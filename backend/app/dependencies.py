"""Зависимости FastAPI: текущий администратор."""

from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth import decode_token, get_admin_by_username

security = HTTPBearer(auto_error=False)


async def get_current_admin(
    db: Annotated[AsyncSession, Depends(get_db)],
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
):
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Не авторизован")
    username = decode_token(creds.credentials)
    if not username:
        raise HTTPException(status_code=401, detail="Недействительный токен")
    admin = await get_admin_by_username(db, username)
    if admin is None:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return admin
