"""Админские роуты: единый префикс /admin внутри /api."""

from fastapi import APIRouter

from app.routers.admin import auth, categories, items, messages, news, stats, upload

admin_router = APIRouter()
admin_router.include_router(auth.router, tags=["admin"])
admin_router.include_router(categories.router, tags=["admin"])
admin_router.include_router(items.router, tags=["admin"])
admin_router.include_router(news.router, tags=["admin"])
admin_router.include_router(messages.router, tags=["admin"])
admin_router.include_router(upload.router, tags=["admin"])
admin_router.include_router(stats.router, tags=["admin"])
