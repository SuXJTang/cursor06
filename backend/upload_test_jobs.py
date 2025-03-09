import requests
import os
import time
import json
from urllib.parse import urlencode

def upload_test_jobs():
    # 登录获取token
    print("获取访问令牌...")
    login_url = "http://127.0.0.1:8000/api/v1/auth/login"
    login_data = {
        "username": "admin@example.com",
        "password": "admin123",
        "grant_type": "password",
        "scope": ""
    }
    login_headers = {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    try:
        print(f"正在发送登录请求到 {login_url}")
        print(f"登录数据: {json.dumps(login_data, ensure_ascii=False, indent=2)}")
        # 使用urlencode转换数据格式
        encoded_data = urlencode(login_data)
        login_response = requests.post(login_url, data=encoded_data, headers=login_headers)
        print(f"登录响应状态码: {login_response.status_code}")
        print(f"登录响应内容: {login_response.text}")
        
        if login_response.status_code == 200:
            access_token = login_response.json()["access_token"]
            print("成功获取访问令牌")
            
            # 上传文件
            print("\n开始上传文件...")
            upload_url = "http://127.0.0.1:8000/api/v1/job-imports/upload"
            headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
            
            file_path = "uploads/test_jobs.xlsx"
            if not os.path.exists(file_path):
                print(f"错误：文件 {file_path} 不存在")
                return
                
            print(f"文件 {file_path} 存在，准备上传")
            
            try:
                with open(file_path, "rb") as f:
                    files = {
                        "file": ("test_jobs.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    }
                    print(f"正在发送上传请求到 {upload_url}")
                    upload_response = requests.post(upload_url, headers=headers, files=files)
                    print(f"上传响应状态码: {upload_response.status_code}")
                    print(f"上传响应内容: {upload_response.text}")
                    
                    if upload_response.status_code == 200:
                        import_id = upload_response.json()["id"]
                        print(f"文件上传成功，导入ID: {import_id}")
                        
                        # 检查导入状态
                        print("\n开始检查导入状态...")
                        status_url = f"http://127.0.0.1:8000/api/v1/job-imports/records/{import_id}"
                        
                        max_retries = 10
                        retry_count = 0
                        
                        while retry_count < max_retries:
                            print(f"\n第 {retry_count + 1} 次检查状态")
                            status_response = requests.get(status_url, headers=headers)
                            print(f"状态检查响应状态码: {status_response.status_code}")
                            print(f"状态检查响应内容: {status_response.text}")
                            
                            if status_response.status_code == 200:
                                status_data = status_response.json()
                                if status_data["status"] in ["completed", "failed"]:
                                    print(f"导入{status_data['status']}，总数：{status_data.get('total_count', 0)}，"
                                          f"成功：{status_data.get('success_count', 0)}，"
                                          f"失败：{status_data.get('failed_count', 0)}")
                                    break
                                    
                            print("等待5秒后重试...")
                            time.sleep(5)
                            retry_count += 1
                            
                        if retry_count >= max_retries:
                            print("达到最大重试次数，导入可能仍在进行中")
                    else:
                        print(f"文件上传失败: {upload_response.text}")
            except Exception as e:
                print(f"上传文件时出错: {str(e)}")
                raise
        else:
            print(f"登录失败: {login_response.text}")
    except requests.exceptions.RequestException as e:
        print(f"网络请求错误: {str(e)}")
        raise
    except Exception as e:
        print(f"发生未知错误: {str(e)}")
        raise

if __name__ == "__main__":
    upload_test_jobs() 