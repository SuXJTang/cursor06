import requests
import json
import os
import time
from datetime import datetime
from sqlalchemy import text
from app.db.session import engine

def check_server_and_db():
    """检查服务器和数据库状态"""
    print("=" * 50)
    print("开始检查服务器和数据库状态")
    print("=" * 50)
    
    # 检查数据库连接
    try:
        with engine.connect() as conn:
            # 检查数据库中的表
            result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            print(f"\n数据库中的表数量: {len(tables)}")
            
            # 检查 job_imports 表是否存在
            if 'job_imports' in tables:
                print("job_imports 表存在")
                
                # 检查 job_imports 表中的记录数
                result = conn.execute(text("SELECT COUNT(*) FROM job_imports"))
                count = result.scalar()
                print(f"job_imports 表中的记录数: {count}")
                
                if count > 0:
                    # 获取最新的记录
                    result = conn.execute(text("SELECT * FROM job_imports ORDER BY id DESC LIMIT 1"))
                    row = result.fetchone()
                    if row:
                        print(f"最新记录: ID={row[0]}, 文件名={row[1]}, 状态={row[6]}")
                else:
                    print("job_imports 表中没有记录，将尝试创建一条记录")
                    # 在服务器重启后自动创建一条记录
                    create_job_import()
            else:
                print("job_imports 表不存在")
    except Exception as e:
        print(f"数据库检查出错: {e}")
    
    # 检查服务器是否运行
    try:
        response = requests.get('http://localhost:8000/docs')
        if response.status_code == 200:
            print("\n服务器正在运行")
            
            # 尝试获取令牌
            token = None
            if os.path.exists("token.json"):
                with open("token.json", "r") as f:
                    token_data = json.load(f)
                    token = token_data.get("access_token")
            
            if token:
                # 设置认证头
                headers = {'Authorization': f'Bearer {token}'}
                
                # 检查 API 端点
                endpoints = [
                    '/api/v1/job-imports/',
                    '/api/v1/job-categories/',
                    '/api/v1/users/test'  # 使用正确的用户测试端点
                ]
                
                for endpoint in endpoints:
                    try:
                        url = f'http://localhost:8000{endpoint}'
                        response = requests.get(url, headers=headers)
                        print(f"端点 {endpoint} 状态码: {response.status_code}")
                        
                        if response.status_code == 200 and endpoint == '/api/v1/job-imports/':
                            data = response.json()
                            print(f"获取到 {len(data)} 条职业导入记录")
                    except Exception as e:
                        print(f"访问端点 {endpoint} 出错: {e}")
            else:
                print("未找到有效的访问令牌，无法检查需要认证的端点")
        else:
            print(f"\n服务器未正常响应，状态码: {response.status_code}")
    except Exception as e:
        print(f"\n服务器未运行或出错: {e}")
    
    print("\n" + "=" * 50)
    print("检查完成")
    print("=" * 50)

def create_job_import():
    """创建一条职业导入记录"""
    # 获取令牌
    token = None
    if os.path.exists("token.json"):
        with open("token.json", "r") as f:
            token_data = json.load(f)
            token = token_data.get("access_token")
    
    if not token:
        print("未找到有效的访问令牌，请先运行 get_token.py")
        return
    
    # 设置认证头
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # 创建新的职业导入记录
    try:
        url = 'http://localhost:8000/api/v1/job-imports/'
        data = {
            "filename": f"test_import_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv",
            "status": "pending",
            "total_count": 100,
            "success_count": 0,
            "failed_count": 0,
            "importer_id": 1  # 使用超级用户ID
        }
        
        print(f'创建新的职业导入记录...')
        print(f'请求数据: {data}')
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200 or response.status_code == 201:
            new_record = response.json()
            print(f'创建成功: {new_record}')
            return True
        else:
            print(f'创建失败: {response.status_code} - {response.text}')
            return False
    except Exception as e:
        print(f'创建记录时出错: {e}')
        return False

if __name__ == "__main__":
    check_server_and_db() 