from pydantic import BaseModel, ConfigDict, Field


class MenuVariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    label: str
    price: int


class MenuItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    image: str | None = None
    variants: list[MenuVariantOut]


class MenuCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    items: list[MenuItemOut]


# Админка: вложенные варианты при создании/редактировании позиции
class MenuVariantIn(BaseModel):
    label: str = Field(..., max_length=50)
    price: int = Field(..., ge=0)
    sort_order: int = 0


class MenuItemCreate(BaseModel):
    category_id: int
    name: str = Field(..., max_length=200)
    image: str | None = Field(None, max_length=500)
    sort_order: int = 0
    is_visible: bool = True
    variants: list[MenuVariantIn] = Field(default_factory=list)


class MenuItemUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(None, max_length=200)
    image: str | None = Field(None, max_length=500)
    sort_order: int | None = None
    is_visible: bool | None = None
    variants: list[MenuVariantIn] | None = None


class MenuItemAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    category_id: str
    name: str
    image: str | None
    sort_order: int
    is_visible: bool
    variants: list[MenuVariantOut]
    createdAt: str | None = None  # ISO, дата добавления записи


class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    sort_order: int | None = None


class CategoryAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    sort_order: int
