from setuptools import setup, find_packages

setup(
    name="cursor06-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.68.0,<0.69.0",
        "pydantic>=1.8.0,<2.0.0",
        "uvicorn>=0.15.0,<0.16.0",
        "SQLAlchemy>=1.4.0,<1.5.0",
        "alembic>=1.7.0,<1.8.0",
        "python-jose[cryptography]>=3.3.0,<3.4.0",
        "passlib[bcrypt]>=1.7.4,<1.8.0",
        "python-multipart>=0.0.5,<0.0.6",
        "pytest>=6.2.5,<6.3.0",
        "requests>=2.26.0,<2.27.0",
        "pymysql>=1.0.2,<1.1.0",
    ],
) 