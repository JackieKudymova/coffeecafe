"""Сохранение загруженных файлов."""

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.config import get_settings

settings = get_settings()

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_CONTENT_PREFIX = ("image/jpeg", "image/png", "image/webp")


def _ext_from_content_type(content_type: str | None) -> str | None:
    if not content_type:
        return None
    ct = content_type.split(";")[0].strip().lower()
    mapping = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }
    return mapping.get(ct)


async def save_upload(file: UploadFile, kind: str) -> str:
    """
    kind: menu | news
    Возвращает путь вида /uploads/menu/uuid.jpg
    """
    if kind not in ("menu", "news"):
        raise HTTPException(status_code=400, detail="Недопустимый тип папки")

    body = await file.read()
    if len(body) > settings.max_upload_bytes:
        raise HTTPException(status_code=400, detail="Файл больше 5 МБ")

    content_type = file.content_type
    if content_type and not any(content_type.startswith(p) for p in ALLOWED_CONTENT_PREFIX):
        raise HTTPException(status_code=400, detail="Разрешены только изображения jpg, png, webp")

    ext = _ext_from_content_type(content_type)
    if ext is None and file.filename:
        name_ext = Path(file.filename).suffix.lower()
        if name_ext in ALLOWED_EXT:
            ext = ".jpg" if name_ext == ".jpeg" else name_ext
    if ext is None or ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Недопустимое расширение файла")

    upload_root = Path(settings.uploads_dir)
    target_dir = upload_root / kind
    target_dir.mkdir(parents=True, exist_ok=True)

    fname = f"{uuid.uuid4().hex}{ext}"
    dest = target_dir / fname
    dest.write_bytes(body)

    return f"/uploads/{kind}/{fname}"
