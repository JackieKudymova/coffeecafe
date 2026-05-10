"""
Учёт зарегистрированных пользователей в админке.
GET /api/admin/users - список с пагинацией и поиском по имени/email/коду.
Нужно админу, чтобы сверять 6-значный код клиента на кассе при выдаче скидки.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.user import User

router = APIRouter()


class UserAdminOut(BaseModel):
    """Поля пользователя, видимые админу. Без хеша пароля."""
    id: int
    name: str
    email: EmailStr
    client_code: str
    discount: int
    created_at: str | None


class UsersPageResult(BaseModel):
    items: list[UserAdminOut]
    total: int
    page: int
    pageSize: int


@router.get("/users", response_model=UsersPageResult)
async def list_users(
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    q: str = Query("", max_length=100),
):
    """
    Возвращает страницу пользователей. Параметр q ищет по подстроке
    в name/email/client_code (без учёта регистра у name/email).
    """
    base = select(User)
    count_base = select(func.count()).select_from(User)
    if q:
        like = f"%{q.strip()}%"
        cond = or_(
            User.name.ilike(like),
            User.email.ilike(like),
            User.client_code.like(like),
        )
        base = base.where(cond)
        count_base = count_base.where(cond)

    total = (await db.execute(count_base)).scalar_one()
    offset = (page - 1) * pageSize
    r = await db.execute(
        base.order_by(User.created_at.desc().nulls_last(), User.id.desc())
        .offset(offset)
        .limit(pageSize)
    )
    rows = r.scalars().all()
    items = [
        UserAdminOut(
            id=u.id,
            name=u.name,
            email=u.email,
            client_code=u.client_code,
            discount=u.discount,
            created_at=u.created_at.isoformat() if u.created_at else None,
        )
        for u in rows
    ]
    return UsersPageResult(items=items, total=total, page=page, pageSize=pageSize)
