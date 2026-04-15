from pydantic import BaseModel


class PromoOut(BaseModel):
    id: str
    title: str
    description: str
    image: str | None = None
    link: str
