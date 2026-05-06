"""Сервис ЛК-аутентификации: JWT юзера, генерация client_code, токены сброса пароля.

Хеш пароля переиспользуем из services.auth (та же bcrypt-функция, что у админа).
JWT для юзеров отличается от админского полем `type: "user"` в payload —
это исключает использование пользовательского токена в админке и наоборот.
"""

import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user import User

settings = get_settings()


def create_user_token(user_id: int) -> str:
    """JWT с `sub`=user_id и `type`=user. Срок жизни — settings.user_token_expire_minutes."""
    expire = datetime.now(UTC) + timedelta(minutes=settings.user_token_expire_minutes)
    payload = {"sub": str(user_id), "type": "user", "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_user_token(token: str) -> int | None:
    """Возвращает user_id, если токен валиден и имеет type=user. Иначе None."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("type") != "user":
            return None
        sub = payload.get("sub")
        if isinstance(sub, str) and sub.isdigit():
            return int(sub)
    except JWTError:
        return None
    return None


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    r = await db.execute(select(User).where(User.email == email.lower()))
    return r.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    r = await db.execute(select(User).where(User.id == user_id))
    return r.scalar_one_or_none()


async def generate_unique_client_code(db: AsyncSession) -> str:
    """Случайный 6-значный код. Если случайно совпал с существующим — пробуем ещё раз.
    Шанс коллизии при 100k клиентов: 100000 / 1000000 = 10%, поэтому в цикле.
    """
    for _ in range(20):
        code = f"{secrets.randbelow(1_000_000):06d}"
        r = await db.execute(select(User.id).where(User.client_code == code))
        if r.scalar_one_or_none() is None:
            return code
    # Защита от теоретически возможной 20-кратной коллизии — fail loud.
    raise RuntimeError("Не удалось сгенерировать уникальный client_code")


# --- Токены сброса пароля ---


def generate_reset_token() -> tuple[str, str]:
    """Возвращает (raw_token, sha256_hex). Сырой — кладём в ссылку письма, хеш — в БД."""
    raw = secrets.token_urlsafe(32)
    hashed = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return raw, hashed


def hash_reset_token(raw: str) -> str:
    """Хеш для поиска токена в БД при confirm."""
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()
