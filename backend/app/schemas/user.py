from typing import Optional

from pydantic import BaseModel, EmailStr, constr

# 共享属性
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False

# 创建用户时需要的属性
class UserCreate(UserBase):
    email: EmailStr
    username: constr(min_length=4, max_length=20)
    password: constr(min_length=8, max_length=32)
    phone: Optional[constr(regex=r'^\d{11}$')] = None

# 更新用户时可以更新的属性
class UserUpdate(UserBase):
    password: Optional[constr(min_length=8, max_length=32)] = None

# 数据库中存储的用户属性
class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True

# API返回的用户信息
class User(UserInDBBase):
    pass

# 数据库中完整的用户信息
class UserInDB(UserInDBBase):
    hashed_password: str 