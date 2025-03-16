import requests
import json
import os

def check_server():
    """检查服务器是否正常运行"""
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
    headers = {'Authorization': f'Bearer {token}'}
    
    endpoints = [
        '/api/v1/health-check',
        '/api/v1/docs',
        '/docs',
        '/api/v1/job-imports'
    ]
    
    for endpoint in endpoints:
        try:
            url = f'http://localhost:8000{endpoint}'
            print(f'\n尝试访问: {url}')
            
            # 对于需要认证的端点，添加认证头
            if 'job-imports' in endpoint:
                response = requests.get(url, headers=headers)
            else:
                response = requests.get(url)
                
            print(f'状态码: {response.status_code}')
            if response.status_code == 200:
                try:
                    print(f'响应内容: {response.json()}')
                except:
                    print('响应内容不是JSON格式')
        except Exception as e:
            print(f'访问出错: {e}')
    
    # 尝试获取 job-imports 列表
    try:
        url = 'http://localhost:8000/api/v1/job-imports'
        print(f'\n尝试获取 job-imports 列表')
        response = requests.get(url, headers=headers)
        print(f'状态码: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'获取到 {len(data)} 条记录')
            if data:
                print(f'第一条记录: {data[0]}')
    except Exception as e:
        print(f'访问出错: {e}')

if __name__ == "__main__":
    check_server() 