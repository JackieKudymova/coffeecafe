"""Статистика для дашборда."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.contact_message import ContactMessage
from app.models.menu_item import MenuItem
from app.models.news import News
from app.schemas.admin_extra import StatsOut

router = APIRouter()


@router.get("/stats", response_model=StatsOut)
async def admin_stats(
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    menu_cnt = (await db.execute(select(func.count()).select_from(MenuItem))).scalar_one()
    news_cnt = (
        await db.execute(
            select(func.count()).select_from(News).where(News.is_published.is_(True))
        )
    ).scalar_one()
    unread = (
        await db.execute(
            select(func.count())
            .select_from(ContactMessage)
            .where(ContactMessage.is_read.is_(False))
        )
    ).scalar_one()
    return StatsOut(
        menu_items_count=menu_cnt,
        published_news_count=news_cnt,
        unread_messages_count=unread,
    )
