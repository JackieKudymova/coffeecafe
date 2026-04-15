from pydantic import BaseModel, ConfigDict, Field


class NewsArticleOut(BaseModel):
    """Публичная новость (как на фронте)."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    image: str | None = None
    excerpt: str
    content: list[str]
    publishedAt: str


class NewsPageResult(BaseModel):
    items: list[NewsArticleOut]
    total: int
    page: int
    pageSize: int


class NewsCreate(BaseModel):
    title: str = Field(..., max_length=300)
    excerpt: str
    content: list[str]  # абзацы
    image: str | None = Field(None, max_length=500)
    is_published: bool = False
    published_at: str | None = None  # YYYY-MM-DD


class NewsUpdate(BaseModel):
    title: str | None = Field(None, max_length=300)
    excerpt: str | None = None
    content: list[str] | None = None
    image: str | None = Field(None, max_length=500)
    is_published: bool | None = None
    published_at: str | None = None


class NewsAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    excerpt: str
    content: list[str]
    image: str | None
    is_published: bool
    publishedAt: str | None
    createdAt: str | None = None  # ISO, дата добавления записи
