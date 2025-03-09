import pytest
from typing import Dict, Generator
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.main import app
from app.tests.utils.user import authentication_token_from_email, create_random_superuser
from app.tests.utils.utils import get_superuser_token_headers

@pytest.fixture(scope="session")
def db() -> Generator:
    """
    数据库会话fixture
    """
    yield SessionLocal()

@pytest.fixture(scope="module")
def client() -> Generator:
    """
    测试客户端fixture
    """
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient, db: Session) -> Dict[str, str]:
    """
    超级用户Token Headers fixture
    """
    superuser = create_random_superuser(db)
    return authentication_token_from_email(
        client=client, email=superuser.email, db=db
    )

@pytest.fixture(scope="module")
def normal_user_token_headers(client: TestClient, db: Session) -> Dict[str, str]:
    """
    普通用户Token Headers fixture
    """
    return authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    ) 