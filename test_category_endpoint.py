#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json

# API配置
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MjM2NTMsInN1YiI6IjEifQ.0rE6kzWBvO_Ti1_Fib9a9qE67qjgz45HjCdAwGQSvgU"
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
CATEGORY_ID = 33  # 软件工程师分类ID

def test_careers_category_api():
    """测试 /api/v1/careers/category/{category_id} 端点"""
    url = f"{BASE_URL}/careers/category/{CATEGORY_ID}"
    
    print(f"测试API端点: {url}")
    try:
        print("正在发送请求...")
        # 添加超时设置为10秒
        response = requests.get(url, headers=HEADERS, timeout=10)
        print(f"收到响应！")
        print(f"响应状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("请求成功！")
            try:
                print(f"响应内容前200个字符: {response.text[:200]}")
                data = response.json()
                print(f"成功解析响应为JSON")
                print(f"响应数据结构: {list(data.keys())}")
                
                if 'careers' in data:
                    careers = data['careers']
                    print(f"获取到 {len(careers)} 条职业数据")
                    
                    # 打印前3条数据的基本信息
                    print("\n前3条职业数据示例:")
                    for i, career in enumerate(careers[:3]):
                        print(f"\n职业 {i+1}:")
                        print(f"  ID: {career.get('id')}")
                        print(f"  职业名称: {career.get('title')}")
                        print(f"  分类ID: {career.get('category_id')}")
                        
                        # 打印薪资范围
                        salary_range = career.get("salary_range", {})
                        if isinstance(salary_range, dict) and 'min' in salary_range and 'max' in salary_range:
                            print(f"  薪资范围: {salary_range['min']}-{salary_range['max']}K")
                        
                        # 打印所需技能
                        required_skills = career.get("required_skills", [])
                        if required_skills:
                            print(f"  所需技能: {', '.join(required_skills[:5])}...")
                        
                        # 打印学历要求
                        print(f"  学历要求: {career.get('education_required', '')}")
                    
                    # 打印总结信息
                    print(f"\n总计获取到 {len(careers)} 条软件工程师相关职业数据")
                    
                    # 列出所有职业名称
                    job_titles = [career.get('title', '') for career in careers]
                    print("\n所有职业名称:")
                    for i, title in enumerate(job_titles):
                        print(f"  {i+1}. {title}")
                else:
                    print("响应中没有找到careers字段")
                    print(f"响应内容: {response.text[:200]}...")
            except json.JSONDecodeError as je:
                print(f"解析JSON失败: {je}")
                print(f"响应内容: {response.text[:500]}")
        else:
            print(f"请求失败，状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
    except requests.exceptions.Timeout:
        print("请求超时！可能是服务器未响应或网络问题。")
    except requests.exceptions.ConnectionError:
        print("连接错误！无法连接到服务器，请检查后端服务是否正在运行。")
    except Exception as e:
        print(f"测试失败，错误信息: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("===== 开始测试软件工程师分类职业API =====")
    test_careers_category_api()
    print("===== 测试结束 =====") 