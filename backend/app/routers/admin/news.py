"""CRUD новостей (админка)."""

import json
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.news import News
from app.schemas.news import NewsAdminOut, NewsCreate, NewsUpdate

router = APIRouter()


def _parse_content(raw: str) -> list[str]:
    try:
        data = json.loads(raw)
        if isinstance(data, list):
            return [str(x) for x in data]
    except (json.JSONDecodeError, TypeError):
        pass
    return []


def _admin_out(n: News) -> NewsAdminOut:
    pub = n.published_at
    published_at_str = pub.date().isoformat() if pub else None
    created_str = n.created_at.isoformat() if n.created_at else None
    return NewsAdminOut(
        id=str(n.id),
        title=n.title,
        excerpt=n.excerpt,
        content=_parse_content(n.content),
        image=n.image,
        is_published=n.is_published,
        publishedAt=published_at_str,
        createdAt=created_str,
    )


def _parse_date(s: str | None) -> datetime | None:
    if not s:
        return None
    try:
        return datetime.strptime(s.strip(), "%Y-%m-%d").replace(tzinfo=None)
    except ValueError:
        return None


@router.get("/news", response_model=list[NewsAdminOut])
async def list_all_news(
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(News).order_by(News.created_at.desc().nulls_last(), News.id.desc()))
    rows = r.scalars().all()
    return [_admin_out(n) for n in rows]


@router.post("/news", response_model=NewsAdminOut)
async def create_news(
    body: NewsCreate,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    pub = _parse_date(body.published_at)
    if body.is_published and pub is None:
        pub = datetime.utcnow()
    n = News(
        title=body.title.strip(),
        excerpt=body.excerpt,
        content=json.dumps(body.content, ensure_ascii=False),
        image=body.image,
        is_published=body.is_published,
        published_at=pub,
    )
    db.add(n)
    await db.commit()
    await db.refresh(n)
    return _admin_out(n)


@router.put("/news/{news_id}", response_model=NewsAdminOut)
async def update_news(
    news_id: int,
    body: NewsUpdate,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(News).where(News.id == news_id))
    n = r.scalar_one_or_none()
    if n is None:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    if body.title is not None:
        n.title = body.title.strip()
    if body.excerpt is not None:
        n.excerpt = body.excerpt
    if body.content is not None:
        n.content = json.dumps(body.content, ensure_ascii=False)
    if body.image is not None:
        n.image = body.image
    if body.is_published is not None:
        n.is_published = body.is_published
    if body.published_at is not None:
        n.published_at = _parse_date(body.published_at)
    elif body.is_published is True and n.published_at is None:
        n.published_at = datetime.utcnow()
    await db.commit()
    await db.refresh(n)
    return _admin_out(n)


@router.delete("/news/{news_id}")
async def delete_news(
    news_id: int,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(News).where(News.id == news_id))
    if r.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    await db.execute(delete(News).where(News.id == news_id))
    await db.commit()
    return {"ok": True}
