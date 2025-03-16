import requests
import json
import os
from datetime import datetime

def create_job_import():
    """检查并创建职业导入记录"""
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
    
    # 先检查是否已存在记录
    try:
        url = 'http://localhost:8000/api/v1/job-imports/'
        print(f'检查是否存在职业导入记录...')
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            existing_records = response.json()
            print(f'找到 {len(existing_records)} 条现有记录')
            
            if existing_records:
                print("已存在职业导入记录，无需创建新记录")
                print(f"第一条记录: {existing_records[0]}")
                return
        else:
            print(f'获取记录失败: {response.status_code} - {response.text}')
            return
    except Exception as e:
        print(f'检查记录时出错: {e}')
        return
    
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
            
            # 再次检查记录列表
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                updated_records = response.json()
                print(f'现在共有 {len(updated_records)} 条记录')
        else:
            print(f'创建失败: {response.status_code} - {response.text}')
    except Exception as e:
        print(f'创建记录时出错: {e}')

if __name__ == "__main__":
    create_job_import() 