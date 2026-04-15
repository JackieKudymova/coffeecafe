"""Публичные новости."""

import json

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException, Query

from app.database import get_db
from app.models.news import News
from app.schemas.news import NewsArticleOut, NewsPageResult

router = APIRouter(tags=["news"])


def _article_from_news(n: News) -> NewsArticleOut:
    try:
        content = json.loads(n.content)
        if not isinstance(content, list):
            content = []
        content = [str(x) for x in content]
    except (json.JSONDecodeError, TypeError):
        content = []
    pub = n.published_at
    published_at_str = pub.date().isoformat() if pub else ""
    return NewsArticleOut(
        id=str(n.id),
        title=n.title,
        image=n.image,
        excerpt=n.excerpt,
        content=content,
        publishedAt=published_at_str,
    )


@router.get("/news", response_model=NewsPageResult)
async def list_news(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    pageSize: int = Query(3, ge=1, le=50),
):
    base = select(News).where(News.is_published.is_(True))
    count_q = select(func.count()).select_from(News).where(News.is_published.is_(True))
    total = (await db.execute(count_q)).scalar_one()
    offset = (page - 1) * pageSize
    result = await db.execute(
        base.order_by(News.published_at.desc().nulls_last(), News.id.desc())
        .offset(offset)
        .limit(pageSize)
    )
    rows = result.scalars().all()
    items = [_article_from_news(n) for n in rows]
    return NewsPageResult(items=items, total=total, page=page, pageSize=pageSize)


@router.get("/news/{news_id}", response_model=NewsArticleOut)
async def get_one_news(news_id: int, db: AsyncSession = Depends(get_db)):
    r = await db.execute(select(News).where(News.id == news_id))
    n = r.scalar_one_or_none()
    if n is None or not n.is_published:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    return _article_from_news(n)
