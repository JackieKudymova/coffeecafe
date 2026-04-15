"""Промо: последняя опубликованная новость."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models.news import News
from app.schemas.promo import PromoOut

router = APIRouter(tags=["promo"])


@router.get("/promos/latest", response_model=PromoOut)
async def latest_promo(db: AsyncSession = Depends(get_db)):
    r = await db.execute(
        select(News)
        .where(News.is_published.is_(True))
        .order_by(News.published_at.desc().nulls_last(), News.id.desc())
        .limit(1)
    )
    n = r.scalar_one_or_none()
    if n is None:
        raise HTTPException(status_code=404, detail="Нет опубликованных новостей")
    # Описание — краткий текст карточки (excerpt)
    return PromoOut(
        id=str(n.id),
        title=n.title,
        description=n.excerpt,
        image=n.image,
        link=f"/news/{n.id}",
    )
