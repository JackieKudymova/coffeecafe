from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    username: str = Field(..., max_length=100)
    password: str = Field(..., max_length=200)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminMeOut(BaseModel):
    username: str


# --- Юзерская часть (ЛК клиента) ---


class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=200)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)


class UserMeOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    client_code: str
    discount: int


class ResetPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordResponse(BaseModel):
    """Всегда отвечаем одинаково — не палим, есть ли email в БД.
    В dev-режиме (без SMTP) возвращаем dev_reset_link, чтобы протестировать flow без почты.
    """

    ok: bool = True
    dev_reset_link: str | None = None


class ResetPasswordConfirmRequest(BaseModel):
    token: str = Field(..., min_length=10, max_length=200)
    new_password: str = Field(..., min_length=6, max_length=200)
