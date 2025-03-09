import requests
import json
import time

def get_access_token():
    """获取访问令牌"""
    login_url = "http://127.0.0.1:8000/api/v1/auth/login"
    login_data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    try:
        response = requests.post(login_url, data=login_data)
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print(f"登录失败: {response.text}")
            return None
    except Exception as e:
        print(f"登录出错: {str(e)}")
        return None

def check_import_status(import_id):
    """检查导入状态"""
    access_token = get_access_token()
    if not access_token:
        return
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    status_url = f"http://127.0.0.1:8000/api/v1/job-imports/records/{import_id}"
    
    max_retries = 10
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            response = requests.get(status_url, headers=headers)
            if response.status_code == 200:
                status_data = response.json()
                print(f"导入状态: {status_data['status']}")
                print(f"总记录数: {status_data['total_count']}")
                print(f"成功数: {status_data['success_count']}")
                print(f"失败数: {status_data['failed_count']}")
                if status_data.get('error_details'):
                    print("错误详情:")
                    print(json.dumps(status_data['error_details'], indent=2, ensure_ascii=False))
                
                if status_data['status'] in ['completed', 'failed']:
                    break
            else:
                print(f"状态码: {response.status_code}")
                print(f"响应: {response.text}")
            
            retry_count += 1
            if retry_count < max_retries:
                print("等待5秒后重试...")
                time.sleep(5)
        except Exception as e:
            print(f"检查状态出错: {str(e)}")
            retry_count += 1
            if retry_count < max_retries:
                print("等待5秒后重试...")
                time.sleep(5)

if __name__ == "__main__":
    # 使用上传响应中返回的导入记录ID
    import_id = 1
    check_import_status(import_id) 