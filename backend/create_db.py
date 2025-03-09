from sqlalchemy import create_engine, text

# 数据库连接配置
DB_USER = 'root'
DB_PASSWORD = '123456'
DB_HOST = 'localhost'
DB_NAME = 'cursor06'

# 创建数据库引擎
engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}')

def create_database():
    # 删除已存在的数据库
    engine.execute(text(f"DROP DATABASE IF EXISTS {DB_NAME}"))
    # 创建新数据库
    engine.execute(text(f"CREATE DATABASE {DB_NAME} CHARACTER SET utf8mb4"))
    print(f"数据库 {DB_NAME} 创建成功")

if __name__ == '__main__':
    create_database() 