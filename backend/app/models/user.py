from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    PREMIUM = "premium"

class User(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.USER
    created_at: datetime = datetime.utcnow()
    last_login: Optional[datetime] = None
    is_active: bool = True
    preferences: dict = {}

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str]
    role: UserRole
    created_at: datetime
    is_active: bool
    preferences: dict