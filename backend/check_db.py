from sqlalchemy import create_engine, inspect

# 数据库连接配置
DB_USER = 'root'
DB_PASSWORD = '123456'
DB_HOST = 'localhost'
DB_NAME = 'cursor06'

# 创建数据库引擎
engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}')

def check_tables():
    inspector = inspect(engine)
    
    print("数据库中的表：")
    for table_name in inspector.get_table_names():
        print(f"\n表名: {table_name}")
        print("列信息:")
        for column in inspector.get_columns(table_name):
            print(f"  - {column['name']}: {column['type']}")

if __name__ == '__main__':
    check_tables() 