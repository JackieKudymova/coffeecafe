"""Загрузка изображений."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.services.upload import save_upload

router = APIRouter()


@router.post("/upload")
async def upload_file(
    _: Annotated[Admin, Depends(get_current_admin)],
    file: UploadFile = File(...),
    kind: str = Form(..., description="menu или news"),
):
    path = await save_upload(file, kind)
    return {"path": path}
