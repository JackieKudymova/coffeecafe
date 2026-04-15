"""Форма обратной связи."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.contact_message import ContactMessage
from app.schemas.contact import ContactCreate, ContactSuccess

router = APIRouter(tags=["contacts"])


@router.post("/contacts", response_model=ContactSuccess)
async def submit_contact(body: ContactCreate, db: AsyncSession = Depends(get_db)):
    msg = ContactMessage(
        name=body.name.strip(),
        phone=body.phone.strip(),
        message=body.message.strip() if body.message else None,
    )
    db.add(msg)
    await db.commit()
    return ContactSuccess(success=True)
