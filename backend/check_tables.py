import pymysql

def check_tables():
    # 数据库连接配置
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='123456',
        database='cursor06',
        charset='utf8mb4'
    )
    
    try:
        with connection.cursor() as cursor:
            # 获取所有表名
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            print("数据库中的表:")
            for table in tables:
                table_name = table[0]
                print(f"\n表名: {table_name}")
                
                # 获取表结构
                cursor.execute(f"DESCRIBE {table_name}")
                columns = cursor.fetchall()
                print("列信息:")
                for column in columns:
                    print(f"  - {column[0]}: {column[1]}")
                
                # 获取索引信息
                cursor.execute(f"SHOW INDEX FROM {table_name}")
                indexes = cursor.fetchall()
                print("索引信息:")
                for index in indexes:
                    print(f"  - {index[2]}: {index[4]}")
            
    except Exception as e:
        print(f"检查表时出错: {e}")
    finally:
        connection.close()

if __name__ == "__main__":
    check_tables() 