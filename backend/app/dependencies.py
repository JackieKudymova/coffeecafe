"""Зависимости FastAPI: текущий администратор и текущий клиент ЛК."""

from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth import decode_token, get_admin_by_username
from app.services.user_auth import decode_user_token, get_user_by_id

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


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
):
    """Юзерская версия. Декодирует JWT с type=user и ищет пользователя по id."""
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Не авторизован")
    user_id = decode_user_token(creds.credentials)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Недействительный токен")
    user = await get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return user
