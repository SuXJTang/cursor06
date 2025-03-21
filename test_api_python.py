#!/usr/bin/env python
import requests
import json
import sys

# 配置参数
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1NTAzMzYsInN1YiI6IjEifQ.0PlNYALurwyaOWZnqJD9pqDsxuyl3PauyulnpRNX2dU"
CAREER_ID = 476
BASE_URL = "http://localhost:8000/api/v1"

# 通用请求头
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def print_separator():
    print("=" * 80)

def print_section(title):
    print_separator()
    print(f"\n{title}\n")
    print_separator()

def analyze_response(response, title="响应分析"):
    print(f"\n--- {title} ---")
    print(f"状态码: {response.status_code}")
    
    try:
        data = response.json()
        print("响应内容类型:", type(data).__name__)
        
        if isinstance(data, dict):
            print("响应对象的键:", list(data.keys()))
            for key, value in data.items():
                print(f"键 '{key}' 的值类型:", type(value).__name__)
                if isinstance(value, list):
                    print(f"  列表长度: {len(value)}")
                    if len(value) > 0:
                        print(f"  第一个元素类型: {type(value[0]).__name__}")
                        if isinstance(value[0], dict):
                            print(f"  第一个元素的键: {list(value[0].keys())}")
        elif isinstance(data, list):
            print("响应是列表，长度:", len(data))
            if len(data) > 0:
                print("第一个元素类型:", type(data[0]).__name__)
                if isinstance(data[0], dict):
                    print("第一个元素的键:", list(data[0].keys()))
        
        print("\n完整响应内容:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"解析响应内容失败: {str(e)}")
        print("原始响应内容:", response.text)

def test_favorite_career():
    print_section("1. 测试收藏职业")
    response = requests.post(f"{BASE_URL}/careers/{CAREER_ID}/favorite", headers=headers)
    analyze_response(response, "收藏职业响应")

def test_check_favorite():
    print_section("2. 测试检查收藏状态")
    response = requests.get(f"{BASE_URL}/careers/{CAREER_ID}/is_favorite", headers=headers)
    analyze_response(response, "检查收藏状态响应")

def test_get_favorites():
    print_section("3. 测试获取收藏列表")
    response = requests.get(f"{BASE_URL}/careers/user/favorites", headers=headers)
    analyze_response(response, "获取收藏列表响应")

def test_unfavorite_career():
    print_section("4. 测试取消收藏")
    response = requests.delete(f"{BASE_URL}/careers/{CAREER_ID}/favorite", headers=headers)
    analyze_response(response, "取消收藏响应")

def main():
    print("===== 使用Python测试收藏职业API =====\n")
    
    try:
        test_favorite_career()
        test_check_favorite()
        test_get_favorites()
        test_unfavorite_career()
        test_check_favorite()  # 再次检查状态
        
        print("\n所有测试完成!")
    except Exception as e:
        print(f"测试过程中出错: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 