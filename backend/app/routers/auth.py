"""Регистрация / логин / профиль / восстановление пароля для клиентов ЛК.

Префикс /api/auth подключается в main.py.
"""

from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.schemas.auth import (
    ResetPasswordConfirmRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    TokenResponse,
    UserLoginRequest,
    UserMeOut,
    UserRegisterRequest,
)
from app.services.auth import hash_password, verify_password
from app.services.email import send_password_reset_email
from app.services.user_auth import (
    create_user_token,
    generate_reset_token,
    generate_unique_client_code,
    get_user_by_email,
    hash_reset_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


@router.post("/register", response_model=TokenResponse)
async def register(body: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    email_lower = body.email.lower()
    existing = await get_user_by_email(db, email_lower)
    if existing is not None:
        raise HTTPException(status_code=409, detail="Пользователь с таким email уже существует")

    user = User(
        name=body.name.strip(),
        email=email_lower,
        password_hash=hash_password(body.password),
        client_code=await generate_unique_client_code(db),
        discount=settings.default_user_discount,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return TokenResponse(access_token=create_user_token(user.id))


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLoginRequest, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, body.email)
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    return TokenResponse(access_token=create_user_token(user.id))


@router.get("/me", response_model=UserMeOut)
async def me(user: Annotated[User, Depends(get_current_user)]):
    return UserMeOut(
        id=user.id,
        name=user.name,
        email=user.email,
        client_code=user.client_code,
        discount=user.discount,
    )


@router.post("/logout")
async def logout(_: Annotated[User, Depends(get_current_user)]):
    """JWT — stateless, серверной сессии нет. Клиент просто удаляет токен.
    Эндпоинт оставлен для симметрии и под будущий blacklist (если понадобится).
    """
    return {"ok": True}


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(body: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Запрос ссылки на сброс. Отвечаем 200 одинаково для известного и неизвестного email
    (защита от перебора аккаунтов). Если email в БД — кладём токен и шлём письмо.
    В dev-режиме (без SMTP) возвращаем dev_reset_link для удобства тестов.
    """
    user = await get_user_by_email(db, body.email)
    response = ResetPasswordResponse()

    if user is None:
        return response

    raw_token, token_hash = generate_reset_token()
    expires = datetime.now(UTC) + timedelta(minutes=settings.password_reset_token_expire_minutes)

    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=expires,
        )
    )
    await db.commit()

    reset_link = f"{settings.frontend_base_url}/reset-password/confirm?token={raw_token}"
    await send_password_reset_email(user.email, reset_link)

    if not settings.mail_username:
        # Только в dev: помогаем фронту/тестировщику получить ссылку без почты.
        response.dev_reset_link = reset_link

    return response


@router.post("/reset-password/confirm", response_model=TokenResponse)
async def reset_password_confirm(
    body: ResetPasswordConfirmRequest,
    db: AsyncSession = Depends(get_db),
):
    """Применяет новый пароль по одноразовому токену из письма.
    По успеху сразу возвращает JWT — пользователь оказывается залогинен.
    """
    token_hash = hash_reset_token(body.token)
    r = await db.execute(
        select(PasswordResetToken).where(PasswordResetToken.token_hash == token_hash)
    )
    token = r.scalar_one_or_none()

    if token is None or token.used_at is not None:
        raise HTTPException(status_code=400, detail="Ссылка недействительна или уже использована")

    # SQLite хранит datetime без таймзоны — приводим к offset-aware для сравнения.
    expires_at = token.expires_at if token.expires_at.tzinfo else token.expires_at.replace(tzinfo=UTC)
    if expires_at < datetime.now(UTC):
        raise HTTPException(status_code=400, detail="Срок действия ссылки истёк")

    user_r = await db.execute(select(User).where(User.id == token.user_id))
    user = user_r.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=400, detail="Пользователь не найден")

    user.password_hash = hash_password(body.new_password)
    token.used_at = datetime.now(UTC)
    await db.commit()

    return TokenResponse(access_token=create_user_token(user.id))
