"""Логин и /me для админки."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.auth import AdminMeOut, LoginRequest, TokenResponse
from app.services.auth import create_access_token, get_admin_by_username, verify_password

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def admin_login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    admin = await get_admin_by_username(db, body.username)
    if admin is None or not verify_password(body.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    token = create_access_token(admin.username)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AdminMeOut)
async def admin_me(admin: Annotated[Admin, Depends(get_current_admin)]):
    return AdminMeOut(username=admin.username)
