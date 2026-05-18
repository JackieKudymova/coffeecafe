"""CRUD позиций меню."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.category import MenuCategory
from app.models.menu_item import MenuItem
from app.models.menu_variant import MenuVariant
from app.schemas.menu import MenuItemAdminOut, MenuItemCreate, MenuItemUpdate, MenuVariantOut

router = APIRouter()


def _item_out(item: MenuItem) -> MenuItemAdminOut:
    vars_sorted = sorted(item.variants, key=lambda v: v.sort_order)
    created_str = item.created_at.isoformat() if item.created_at else None
    return MenuItemAdminOut(
        id=str(item.id),
        category_id=str(item.category_id),
        name=item.name,
        image=item.image,
        sort_order=item.sort_order,
        is_visible=item.is_visible,
        variants=[MenuVariantOut(label=v.label, price=v.price) for v in vars_sorted],
        ingredients=item.ingredients,
        allergen_milk=item.allergen_milk,
        allergen_gluten=item.allergen_gluten,
        allergen_egg=item.allergen_egg,
        createdAt=created_str,
    )


async def _count_in_category(db: AsyncSession, category_id: int) -> int:
    """Сколько уже позиций в категории."""
    r = await db.execute(
        select(func.count()).select_from(MenuItem).where(MenuItem.category_id == category_id)
    )
    return int(r.scalar_one() or 0)


async def _shift_for_insert(db: AsyncSession, category_id: int, position: int) -> None:
    """Перед вставкой на позицию N все позиции >= N сдвигаем на +1."""
    await db.execute(
        update(MenuItem)
        .where(MenuItem.category_id == category_id, MenuItem.sort_order >= position)
        .values(sort_order=MenuItem.sort_order + 1)
    )


async def _shift_for_delete(db: AsyncSession, category_id: int, position: int) -> None:
    """После удаления позиции N все позиции > N сдвигаем на -1, чтобы остался ряд 1..N-1."""
    await db.execute(
        update(MenuItem)
        .where(MenuItem.category_id == category_id, MenuItem.sort_order > position)
        .values(sort_order=MenuItem.sort_order - 1)
    )


async def _shift_for_move(
    db: AsyncSession, category_id: int, old_pos: int, new_pos: int, item_id: int
) -> None:
    """
    Перенос позиции внутри категории с учётом сдвига соседей.
    Двигаем только чужие строки (не сам item_id).
    """
    if new_pos == old_pos:
        return
    if new_pos < old_pos:
        # Двигаем item вверх. Соседи в [new, old) уходят вниз на +1.
        await db.execute(
            update(MenuItem)
            .where(
                MenuItem.category_id == category_id,
                MenuItem.id != item_id,
                MenuItem.sort_order >= new_pos,
                MenuItem.sort_order < old_pos,
            )
            .values(sort_order=MenuItem.sort_order + 1)
        )
    else:
        # Двигаем item вниз. Соседи в (old, new] идут вверх на -1.
        await db.execute(
            update(MenuItem)
            .where(
                MenuItem.category_id == category_id,
                MenuItem.id != item_id,
                MenuItem.sort_order > old_pos,
                MenuItem.sort_order <= new_pos,
            )
            .values(sort_order=MenuItem.sort_order - 1)
        )


@router.get("/items", response_model=list[MenuItemAdminOut])
async def list_items(
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
    category_id: int | None = Query(None),
):
    q = select(MenuItem).options(selectinload(MenuItem.variants)).order_by(
        MenuItem.created_at.desc().nulls_last(), MenuItem.id.desc()
    )
    if category_id is not None:
        q = q.where(MenuItem.category_id == category_id)
    r = await db.execute(q)
    rows = r.scalars().unique().all()
    return [_item_out(i) for i in rows]


@router.post("/items", response_model=MenuItemAdminOut)
async def create_item(
    body: MenuItemCreate,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(MenuCategory).where(MenuCategory.id == body.category_id))
    if r.scalar_one_or_none() is None:
        raise HTTPException(status_code=400, detail="Категория не найдена")

    # Валидация порядкового номера: 1..N+1.
    # Если фронт прислал 0/мусор - ставим в конец.
    n = await _count_in_category(db, body.category_id)
    requested = body.sort_order if body.sort_order and body.sort_order >= 1 else n + 1
    if requested > n + 1:
        requested = n + 1

    # Сдвигаем соседей >= requested на +1, чтобы освободить место.
    await _shift_for_insert(db, body.category_id, requested)
    await db.flush()

    item = MenuItem(
        category_id=body.category_id,
        name=body.name.strip(),
        image=body.image,
        sort_order=requested,
        is_visible=body.is_visible,
        ingredients=(body.ingredients.strip() if body.ingredients else None) or None,
        allergen_milk=body.allergen_milk,
        allergen_gluten=body.allergen_gluten,
        allergen_egg=body.allergen_egg,
    )
    db.add(item)
    await db.flush()
    for i, v in enumerate(body.variants):
        db.add(
            MenuVariant(
                item_id=item.id,
                label=v.label.strip(),
                price=v.price,
                sort_order=v.sort_order if v.sort_order else i,
            )
        )
    await db.commit()
    r2 = await db.execute(
        select(MenuItem)
        .options(selectinload(MenuItem.variants))
        .where(MenuItem.id == item.id)
    )
    item = r2.scalar_one()
    return _item_out(item)


@router.put("/items/{item_id}", response_model=MenuItemAdminOut)
async def update_item(
    item_id: int,
    body: MenuItemUpdate,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(
        select(MenuItem).options(selectinload(MenuItem.variants)).where(MenuItem.id == item_id)
    )
    item = r.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Позиция не найдена")

    old_category_id = item.category_id
    old_sort_order = item.sort_order

    new_category_id = body.category_id if body.category_id is not None else old_category_id
    if body.category_id is not None and body.category_id != old_category_id:
        cr = await db.execute(select(MenuCategory).where(MenuCategory.id == body.category_id))
        if cr.scalar_one_or_none() is None:
            raise HTTPException(status_code=400, detail="Категория не найдена")

    if body.name is not None:
        item.name = body.name.strip()
    if body.image is not None:
        item.image = body.image
    if body.is_visible is not None:
        item.is_visible = body.is_visible
    if body.ingredients is not None:
        s = body.ingredients.strip()
        item.ingredients = s if s else None
    if body.allergen_milk is not None:
        item.allergen_milk = body.allergen_milk
    if body.allergen_gluten is not None:
        item.allergen_gluten = body.allergen_gluten
    if body.allergen_egg is not None:
        item.allergen_egg = body.allergen_egg
    if body.variants is not None:
        for old_v in list(item.variants):
            await db.delete(old_v)
        await db.flush()
        for i, v in enumerate(body.variants):
            db.add(
                MenuVariant(
                    item_id=item.id,
                    label=v.label.strip(),
                    price=v.price,
                    sort_order=v.sort_order if v.sort_order else i,
                )
            )

    # Перенос позиции: вычисляем целевой sort_order, сдвигаем соседей.
    # Сценарии:
    #   а) категория не менялась, sort_order не менялся - ничего не делаем;
    #   б) категория не менялась, sort_order поменялся - двигаем соседей в этой категории;
    #   в) категория поменялась - удаляем из старой (соседи сдвигаются вверх), вставляем в новую.
    if body.category_id is not None and new_category_id != old_category_id:
        # «Удаляем» из старой категории - соседи > old_sort_order сдвигаются на -1.
        await _shift_for_delete(db, old_category_id, old_sort_order)
        await db.flush()
        # Считаем новый размер целевой категории; здесь сам item ещё с old category_id.
        n_new = await _count_in_category(db, new_category_id)
        target = body.sort_order if body.sort_order and body.sort_order >= 1 else n_new + 1
        if target > n_new + 1:
            target = n_new + 1
        await _shift_for_insert(db, new_category_id, target)
        await db.flush()
        item.category_id = new_category_id
        item.sort_order = target
    elif body.sort_order is not None and body.sort_order != old_sort_order:
        # Внутри одной категории: 1..N (сам item уже среди N).
        n_cur = await _count_in_category(db, old_category_id)
        target = body.sort_order if body.sort_order >= 1 else 1
        if target > n_cur:
            target = n_cur
        await _shift_for_move(db, old_category_id, old_sort_order, target, item.id)
        await db.flush()
        item.sort_order = target

    await db.commit()
    r2 = await db.execute(
        select(MenuItem)
        .options(selectinload(MenuItem.variants))
        .where(MenuItem.id == item_id)
    )
    item = r2.scalar_one()
    return _item_out(item)


@router.delete("/items/{item_id}")
async def delete_item(
    item_id: int,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    item = r.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Позиция не найдена")
    cat_id = item.category_id
    pos = item.sort_order
    await db.execute(delete(MenuItem).where(MenuItem.id == item_id))
    await db.flush()
    # После удаления подтягиваем соседей вверх, чтобы остался непрерывный ряд 1..N-1.
    await _shift_for_delete(db, cat_id, pos)
    await db.commit()
    return {"ok": True}
