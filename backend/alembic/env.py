"""Alembic: миграции (синхронный sqlite3 или psycopg2 при DATABASE_URL на PostgreSQL)."""

import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool

from alembic import context

# Регистрируем метаданные всех моделей
from app.models.base import Base
from app.models import admin, category, contact_message, menu_item, menu_variant, news  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    sync = os.getenv("DATABASE_URL_SYNC")
    if sync:
        return sync
    async_url = os.getenv("DATABASE_URL", "")
    if "+asyncpg" in async_url:
        return async_url.replace("postgresql+asyncpg", "postgresql", 1)
    if "+aiosqlite" in async_url:
        return async_url.replace("sqlite+aiosqlite", "sqlite", 1)
    return "sqlite:///./domkofe.db"


def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
