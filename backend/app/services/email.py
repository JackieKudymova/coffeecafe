"""Отправка email-писем.

Если в .env не задан mail_username — работаем в dev-режиме:
письмо не уходит, ссылка просто печатается в консоль бэкенда.
Это позволяет тестировать flow без настройки SMTP.

При деплое заполнить .env (MAIL_USERNAME / MAIL_PASSWORD / MAIL_FROM /
MAIL_SERVER / MAIL_PORT) — реальная отправка включится автоматически.
"""

import logging

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_password_reset_email(to_email: str, reset_link: str) -> None:
    """Отправляет письмо с ссылкой на сброс пароля.
    В dev-режиме просто логирует ссылку.
    """
    subject = "Восстановление пароля — ДомКофе"
    body = (
        f"Здравствуйте!\n\n"
        f"Вы запросили восстановление пароля в личном кабинете ДомКофе.\n"
        f"Для установки нового пароля перейдите по ссылке (она действительна 30 минут):\n\n"
        f"{reset_link}\n\n"
        f"Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.\n\n"
        f"С уважением,\nКоманда ДомКофе"
    )

    if not settings.mail_username:
        # Dev-режим: SMTP не настроен.
        logger.warning("=" * 60)
        logger.warning("[DEV MAIL] Письмо НЕ отправлено (SMTP не настроен).")
        logger.warning("Кому: %s", to_email)
        logger.warning("Тема: %s", subject)
        logger.warning("Ссылка для сброса: %s", reset_link)
        logger.warning("=" * 60)
        return

    # Prod-режим: реальная отправка через fastapi-mail.
    # Импорт внутри функции, чтобы dev не требовал установленного fastapi-mail.
    from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

    config = ConnectionConfig(
        MAIL_USERNAME=settings.mail_username,
        MAIL_PASSWORD=settings.mail_password,
        MAIL_FROM=settings.mail_from,
        MAIL_FROM_NAME=settings.mail_from_name,
        MAIL_SERVER=settings.mail_server,
        MAIL_PORT=settings.mail_port,
        MAIL_STARTTLS=settings.mail_starttls,
        MAIL_SSL_TLS=settings.mail_ssl_tls,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )
    message = MessageSchema(
        subject=subject,
        recipients=[to_email],
        body=body,
        subtype=MessageType.plain,
    )
    await FastMail(config).send_message(message)
