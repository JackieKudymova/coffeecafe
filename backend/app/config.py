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
    # JWT для пользователей ЛК — 7 дней
    user_token_expire_minutes: int = 60 * 24 * 7

    uploads_dir: str = "./uploads"  # в Docker: UPLOADS_DIR=/app/uploads
    max_upload_bytes: int = 5 * 1024 * 1024

    admin_username: str = "admin"
    admin_password: str = "admin123"

    # Скидка по умолчанию для новых клиентов (по макету ЛК — 10%).
    default_user_discount: int = 10

    # База фронта — нужна, чтобы собирать ссылку для письма восстановления пароля.
    # На проде задаётся через .env (например https://domkofe.ru).
    frontend_base_url: str = "http://localhost:5173"

    # Срок жизни токена сброса пароля (минуты).
    password_reset_token_expire_minutes: int = 30

    # Почта для отправки писем восстановления.
    # Если mail_username пуст — режим dev: письма не отправляются, ссылка
    # печатается в консоль и возвращается в ответе API (поле dev_reset_link).
    mail_username: str = ""
    mail_password: str = ""
    mail_from: str = "no-reply@domkofe.ru"
    mail_from_name: str = "ДомКофе"
    mail_server: str = "smtp.yandex.ru"
    mail_port: int = 465
    mail_starttls: bool = False
    mail_ssl_tls: bool = True

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
