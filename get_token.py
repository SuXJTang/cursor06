#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"
USERNAME = "admin"
PASSWORD = "admin"

def get_token():
    """获取认证TOKEN"""
    url = f"{BASE_URL}/auth/token"
    data = {
        "username": USERNAME,
        "password": PASSWORD
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    try:
        print(f"请求TOKEN URL: {url}")
        response = requests.post(url, data=data, headers=headers)
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            json_data = response.json()
            if "access_token" in json_data:
                token = json_data["access_token"]
                print(f"\n获取到TOKEN: {token}")
                return token
        
        return None
    except Exception as e:
        print(f"获取TOKEN失败: {e}")
        return None

if __name__ == "__main__":
    print("===== 获取API认证TOKEN =====")
    token = get_token()
    if token:
        print("\n可以使用以下TOKEN进行API认证:")
        print(f'TOKEN = "{token}"')
    else:
        print("\n获取TOKEN失败!")
    print("===== 结束 =====") 