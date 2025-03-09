import random
import string
from typing import Dict

from fastapi.testclient import TestClient

from app.core.config import settings

def random_lower_string() -> str:
    """生成随机小写字符串"""
    return "".join(random.choices(string.ascii_lowercase, k=10))

def random_email() -> str:
    """生成随机邮箱"""
    return f"{random_lower_string()}@{random_lower_string()}.com"

def random_dict(prefix: str = "") -> Dict[str, str]:
    """生成随机字典"""
    return {
        f"{prefix}key_{i}": f"value_{random_lower_string()}"
        for i in range(random.randint(1, 5))
    }

def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    """获取超级用户的认证令牌"""
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = client.post("/api/v1/auth/login", data=login_data)
    tokens = r.json()
    auth_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers 