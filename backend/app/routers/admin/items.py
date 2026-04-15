"""CRUD позиций меню."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import delete, select
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
        createdAt=created_str,
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
    item = MenuItem(
        category_id=body.category_id,
        name=body.name.strip(),
        image=body.image,
        sort_order=body.sort_order,
        is_visible=body.is_visible,
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
    if body.category_id is not None:
        cr = await db.execute(select(MenuCategory).where(MenuCategory.id == body.category_id))
        if cr.scalar_one_or_none() is None:
            raise HTTPException(status_code=400, detail="Категория не найдена")
        item.category_id = body.category_id
    if body.name is not None:
        item.name = body.name.strip()
    if body.image is not None:
        item.image = body.image
    if body.sort_order is not None:
        item.sort_order = body.sort_order
    if body.is_visible is not None:
        item.is_visible = body.is_visible
    if body.variants is not None:
        await db.execute(delete(MenuVariant).where(MenuVariant.item_id == item.id))
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
    await db.execute(delete(MenuItem).where(MenuItem.id == item_id))
    await db.commit()
    return {"ok": True}
