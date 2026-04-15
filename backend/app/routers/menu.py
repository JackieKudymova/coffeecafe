"""Публичное меню."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from fastapi import APIRouter, Depends

from app.database import get_db
from app.models.category import MenuCategory
from app.models.menu_item import MenuItem
from app.models.menu_variant import MenuVariant
from app.schemas.menu import MenuCategoryOut, MenuItemOut, MenuVariantOut

router = APIRouter(tags=["menu"])


@router.get("/menu", response_model=list[MenuCategoryOut])
async def get_public_menu(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MenuCategory)
        .options(
            selectinload(MenuCategory.items).selectinload(MenuItem.variants),
        )
        .order_by(MenuCategory.sort_order)
    )
    cats = result.scalars().unique().all()
    out: list[MenuCategoryOut] = []
    for c in cats:
        items_out: list[MenuItemOut] = []
        for item in c.items:
            if not item.is_visible:
                continue
            vars_out = [
                MenuVariantOut(label=v.label, price=v.price)
                for v in sorted(item.variants, key=lambda x: x.sort_order)
            ]
            items_out.append(
                MenuItemOut(
                    id=str(item.id),
                    name=item.name,
                    image=item.image,
                    variants=vars_out,
                )
            )
        out.append(
            MenuCategoryOut(
                id=str(c.id),
                name=c.name,
                items=items_out,
            )
        )
    return out
