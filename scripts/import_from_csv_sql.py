import csv
import json
import pymysql
import time
from datetime import datetime
import argparse

# 数据库配置
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "cursor06",
    "port": 3306
}

def connect_db():
    """连接到MySQL数据库"""
    try:
        conn = pymysql.connect(**DB_CONFIG)
        print("成功连接到数据库")
        return conn
    except Exception as e:
        print(f"连接数据库时发生错误: {str(e)}")
        return None

def parse_list(value):
    """解析包含列表的字段"""
    if not value:
        return []
    try:
        return json.loads(value.replace("'", "\""))
    except:
        return [item.strip() for item in value.split(',')]

def parse_dict(value):
    """解析包含字典的字段"""
    if not value:
        return {}
    try:
        return json.loads(value.replace("'", "\""))
    except:
        return {}

def insert_career(conn, career_data):
    """向数据库中插入职业数据"""
    try:
        with conn.cursor() as cursor:
            # 准备要插入的数据
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # 将列表和字典转换为JSON字符串
            required_skills = json.dumps(career_data["required_skills"], ensure_ascii=False)
            career_path = json.dumps(career_data["career_path"], ensure_ascii=False)
            salary_range = json.dumps(career_data["salary_range"], ensure_ascii=False)
            
            # SQL插入语句
            sql = """
            INSERT INTO careers (
                title, description, category_id, required_skills, 
                education_required, experience_required, career_path, 
                salary_range, future_prospect, created_at, updated_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            """
            
            # 执行SQL
            cursor.execute(sql, (
                career_data["title"],
                career_data["description"],
                career_data["category_id"],
                required_skills,
                career_data["education_required"],
                career_data["experience_required"],
                career_path,
                salary_range,
                career_data["future_prospect"],
                now,
                now
            ))
            
            # 提交事务
            conn.commit()
            print(f"成功插入职业: {career_data['title']}")
            return True
            
    except Exception as e:
        # 回滚事务
        conn.rollback()
        print(f"插入职业时发生错误: {career_data['title']}, 错误: {str(e)}")
        return False

def main():
    """主函数"""
    # 设置命令行参数
    parser = argparse.ArgumentParser(description='从CSV文件使用SQL方式批量导入职业数据')
    parser.add_argument('csv_file', help='CSV文件路径')
    parser.add_argument('--delay', type=float, default=0.1, help='插入之间的延迟时间(秒)')
    args = parser.parse_args()
    
    csv_file = args.csv_file
    delay = args.delay
    
    print(f"开始从CSV文件 {csv_file} 使用SQL方式导入职业数据...")
    
    # 连接数据库
    conn = connect_db()
    if not conn:
        print("无法连接到数据库，程序终止")
        return
    
    try:
        # 统计
        success_count = 0
        fail_count = 0
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            # 调试信息：打印CSV文件内容
            content = file.read()
            print(f"CSV文件内容预览:\n{content[:500]}...")
            
            # 重新定位到文件开始位置
            file.seek(0)
            
            reader = csv.DictReader(file)
            rows = list(reader)
            print(f"读取到 {len(rows)} 行数据")
            
            for row in rows:
                print(f"处理行: {row}")
                # 处理可能的列表和字典字段
                career_data = {
                    "title": row.get('title', ''),
                    "description": row.get('description', ''),
                    "category_id": int(row.get('category_id', 0)),
                    "required_skills": parse_list(row.get('required_skills', '')),
                    "education_required": row.get('education_required', ''),
                    "experience_required": row.get('experience_required', ''),
                    "career_path": parse_list(row.get('career_path', '')),
                    "salary_range": parse_dict(row.get('salary_range', '')),
                    "future_prospect": row.get('future_prospect', '')
                }
                
                # 尝试插入数据
                result = insert_career(conn, career_data)
                
                if result:
                    success_count += 1
                else:
                    fail_count += 1
                
                # 小延迟，避免过快操作数据库
                time.sleep(delay)
        
        print(f"\n导入完成! 成功: {success_count}, 失败: {fail_count}")
        
    except Exception as e:
        print(f"处理CSV文件时发生错误: {str(e)}")
        
    finally:
        # 关闭数据库连接
        conn.close()
        print("数据库连接已关闭")

if __name__ == "__main__":
    main() 