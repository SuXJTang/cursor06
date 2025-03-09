from typing import Dict

from fastapi.testclient import TestClient

from app.core.config import settings


def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    """
    获取超级用户的Token Headers
    """
    login_data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    r = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers 