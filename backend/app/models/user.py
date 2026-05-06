"""Модель пользователя ЛК (клиента)."""

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    # 6-значный код клиента (показывается в ЛК для скидки на кассе).
    # Храним как строку, чтобы не терять ведущие нули.
    client_code: Mapped[str] = mapped_column(String(6), unique=True, nullable=False, index=True)
    discount: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    created_at: Mapped[datetime | None] = mapped_column(DateTime, server_default=func.now())
