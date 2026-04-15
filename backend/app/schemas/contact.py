from pydantic import BaseModel, Field


class ContactCreate(BaseModel):
    name: str = Field(..., max_length=200)
    phone: str = Field(..., max_length=20)
    message: str | None = None


class ContactSuccess(BaseModel):
    success: bool = True
