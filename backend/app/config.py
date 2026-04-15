"""Настройки приложения из переменных окружения."""

from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite+aiosqlite:///./domkofe.db"
    # Для Alembic (синхронный sqlite3); если не задан — из database_url
    database_url_sync: str | None = None

    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    uploads_dir: str = "./uploads"  # в Docker: UPLOADS_DIR=/app/uploads
    max_upload_bytes: int = 5 * 1024 * 1024

    admin_username: str = "admin"
    admin_password: str = "admin123"

    @model_validator(mode="after")
    def fill_sync_url(self):
        if self.database_url_sync is not None:
            return self
        url = self.database_url
        if "sqlite+aiosqlite" in url:
            sync = url.replace("sqlite+aiosqlite", "sqlite", 1)
        elif "postgresql+asyncpg" in url:
            sync = url.replace("postgresql+asyncpg", "postgresql", 1)
        else:
            sync = url
        object.__setattr__(self, "database_url_sync", sync)
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
