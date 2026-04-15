"""Схемы для сообщений и статистики."""

from pydantic import BaseModel, ConfigDict, Field


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    phone: str
    message: str | None
    created_at: str
    is_read: bool


class MessagesPageResult(BaseModel):
    items: list[MessageOut]
    total: int
    page: int
    pageSize: int


class MessagePatch(BaseModel):
    is_read: bool


class StatsOut(BaseModel):
    menu_items_count: int
    published_news_count: int
    unread_messages_count: int
