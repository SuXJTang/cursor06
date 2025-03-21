#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MjM2NTMsInN1YiI6IjEifQ.0rE6kzWBvO_Ti1_Fib9a9qE67qjgz45HjCdAwGQSvgU"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
CATEGORY_ID = 33  # 软件工程师分类ID

# 要测试的端点列表
endpoints = [
    f"{BASE_URL}/careers/category/{CATEGORY_ID}",
    f"{BASE_URL}/careers/category/{CATEGORY_ID}?limit=50&offset=0",
    f"{BASE_URL}/careers/category/{CATEGORY_ID}/careers",
    f"{BASE_URL}/careers/category/{CATEGORY_ID}/careers?limit=50&offset=0",
    f"{BASE_URL}/careers?category_id={CATEGORY_ID}",
    f"{BASE_URL}/careers/?category_id={CATEGORY_ID}",
    f"{BASE_URL}/careers/by-category/{CATEGORY_ID}",
    f"{BASE_URL}/careers/by-category/{CATEGORY_ID}?limit=50&offset=0",
    f"{BASE_URL}/category/{CATEGORY_ID}/careers",
    f"{BASE_URL}/category/{CATEGORY_ID}/careers?limit=50&offset=0",
]

def check_endpoint(url):
    """检查API端点是否可用"""
    print(f"\n检查端点: {url}")
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"状态码: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict):
                if 'items' in data:
                    print(f"找到items字段，包含 {len(data['items'])} 条记录")
                if 'careers' in data:
                    print(f"找到careers字段，包含 {len(data['careers'])} 条记录")
                if 'total' in data:
                    print(f"总记录数: {data['total']}")
            elif isinstance(data, list):
                print(f"响应是列表，包含 {len(data)} 条记录")
            print(f"响应内容片段: {str(response.text)[:150]}...")
        else:
            print(f"响应内容: {response.text}")
        return response.status_code, response.text
    except Exception as e:
        print(f"请求失败: {e}")
        return None, str(e)

def main():
    """主函数"""
    print("检查可用的API端点...")
    successful_endpoints = []
    
    for url in endpoints:
        status_code, response_text = check_endpoint(url)
        if status_code == 200:
            successful_endpoints.append(url)
    
    print("\n可用的API端点:")
    for url in successful_endpoints:
        print(f"- {url}")
    
    if not successful_endpoints:
        print("没有找到可用的API端点")

if __name__ == "__main__":
    main() 