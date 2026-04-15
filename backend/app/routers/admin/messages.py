"""Обращения с формы."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.contact_message import ContactMessage
from app.schemas.admin_extra import MessageOut, MessagePatch, MessagesPageResult

router = APIRouter()


@router.get("/messages", response_model=MessagesPageResult)
async def list_messages(
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
):
    count_q = select(func.count()).select_from(ContactMessage)
    total = (await db.execute(count_q)).scalar_one()
    offset = (page - 1) * pageSize
    r = await db.execute(
        select(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .offset(offset)
        .limit(pageSize)
    )
    rows = r.scalars().all()
    items = [
        MessageOut(
            id=str(m.id),
            name=m.name,
            phone=m.phone,
            message=m.message,
            created_at=m.created_at.isoformat() if m.created_at else "",
            is_read=m.is_read,
        )
        for m in rows
    ]
    return MessagesPageResult(items=items, total=total, page=page, pageSize=pageSize)


def _message_to_out(m: ContactMessage) -> MessageOut:
    return MessageOut(
        id=str(m.id),
        name=m.name,
        phone=m.phone,
        message=m.message,
        created_at=m.created_at.isoformat() if m.created_at else "",
        is_read=m.is_read,
    )


@router.get("/messages/{msg_id}", response_model=MessageOut)
async def get_message(
    msg_id: int,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    m = r.scalar_one_or_none()
    if m is None:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    return _message_to_out(m)


@router.patch("/messages/{msg_id}", response_model=MessageOut)
async def patch_message(
    msg_id: int,
    body: MessagePatch,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    m = r.scalar_one_or_none()
    if m is None:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    m.is_read = body.is_read
    await db.commit()
    await db.refresh(m)
    return _message_to_out(m)


@router.put("/messages/{msg_id}/read")
async def mark_read(
    msg_id: int,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    m = r.scalar_one_or_none()
    if m is None:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    m.is_read = True
    await db.commit()
    return {"ok": True}


@router.delete("/messages/{msg_id}")
async def delete_message(
    msg_id: int,
    _: Annotated[Admin, Depends(get_current_admin)],
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import delete

    r = await db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
    if r.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    await db.execute(delete(ContactMessage).where(ContactMessage.id == msg_id))
    await db.commit()
    return {"ok": True}
