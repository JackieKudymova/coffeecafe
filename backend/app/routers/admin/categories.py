"""CRUD категорий меню."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.category import MenuCategory
from app.schemas.menu import CategoryAdminOut, CategoryCreate, CategoryUpdate

router = APIRouter()


@router.get("/categories", response_model=list[CategoryAdminOut])
async def list_categories(
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(MenuCategory).order_by(MenuCategory.sort_order, MenuCategory.id))
    rows = r.scalars().all()
    return [
        CategoryAdminOut(id=str(c.id), name=c.name, sort_order=c.sort_order) for c in rows
    ]


@router.post("/categories", response_model=CategoryAdminOut)
async def create_category(
    body: CategoryCreate,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    c = MenuCategory(name=body.name.strip(), sort_order=body.sort_order)
    db.add(c)
    await db.commit()
    await db.refresh(c)
    return CategoryAdminOut(id=str(c.id), name=c.name, sort_order=c.sort_order)


@router.put("/categories/{category_id}", response_model=CategoryAdminOut)
async def update_category(
    category_id: int,
    body: CategoryUpdate,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(MenuCategory).where(MenuCategory.id == category_id))
    c = r.scalar_one_or_none()
    if c is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    if body.name is not None:
        c.name = body.name.strip()
    if body.sort_order is not None:
        c.sort_order = body.sort_order
    await db.commit()
    await db.refresh(c)
    return CategoryAdminOut(id=str(c.id), name=c.name, sort_order=c.sort_order)


@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(MenuCategory).where(MenuCategory.id == category_id))
    c = r.scalar_one_or_none()
    if c is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    await db.execute(delete(MenuCategory).where(MenuCategory.id == category_id))
    await db.commit()
    return {"ok": True}
