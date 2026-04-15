"""Точка входа FastAPI: роутеры, CORS, статика uploads."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.routers.admin import admin_router
from app.routers import contacts, menu, news, promo

settings = get_settings()

app = FastAPI(title="ДомКофе API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Публичные эндпоинты
app.include_router(menu.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(promo.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")

# Админка: /api/admin/...
app.include_router(admin_router, prefix="/api/admin")

# Локальная раздача загруженных файлов (в Docker их отдаёт nginx)
uploads_path = Path(settings.uploads_dir)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}
