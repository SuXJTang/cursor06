import requests
import json
from typing import Dict, Any, List, Optional
import sys

# API配置
BASE_URL = 'http://127.0.0.1:8000'
# 更新为前端脚本实际使用的token获取方式
TOKEN = None

# 尝试从文件读取token
try:
    # 如果前端本地存储有token，可以直接复制出来放在token.txt文件中
    with open('token.txt', 'r') as f:
        TOKEN = f.read().strip()
except FileNotFoundError:
    print("未找到token.txt文件，将尝试无token访问")
except Exception as e:
    print(f"读取token出错: {e}")

# 请求头
HEADERS = {}
if TOKEN:
    HEADERS['Authorization'] = f'Bearer {TOKEN}'

def check_endpoint(url: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """检查API端点是否可访问，并返回响应内容"""
    try:
        response = requests.get(url, headers=HEADERS, params=params, timeout=10)
        status_code = response.status_code
        
        print(f'请求 {url}')
        print(f'状态码: {status_code}')
        
        if status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f'返回 {len(data)} 条记录')
                elif isinstance(data, dict) and 'items' in data:
                    print(f'返回 {len(data["items"])} 条记录 (分页数据)')
                else:
                    print('返回 JSON 数据')
                return {'status': status_code, 'data': data}
            except ValueError:
                print('返回非 JSON 数据')
                return {'status': status_code, 'data': response.text[:100] + '...'}
        else:
            try:
                error_data = response.json()
                print(f'错误响应: {json.dumps(error_data, ensure_ascii=False)}')
                return {'status': status_code, 'error': error_data}
            except ValueError:
                print(f'错误响应: {response.text[:100]}...')
                return {'status': status_code, 'error': response.text[:100]}
    except Exception as e:
        print(f'请求异常: {str(e)}')
        return {'status': -1, 'error': str(e)}

def test_category_api():
    """测试分类API"""
    print("\n===== 测试分类API =====")
    result = check_endpoint(f'{BASE_URL}/api/v1/career-categories/roots?include_children=true')
    
    if result['status'] == 200 and isinstance(result['data'], list):
        # 查找软件工程师分类ID
        software_eng_category = None
        
        def find_software_category(categories):
            for category in categories:
                if '软件' in category.get('name', '') and '工程' in category.get('name', ''):
                    return category
                
                subcategories = category.get('subcategories', [])
                if subcategories:
                    found = find_software_category(subcategories)
                    if found:
                        return found
            return None
        
        software_eng_category = find_software_category(result['data'])
        
        if software_eng_category:
            print(f"\n找到软件工程师分类: ID={software_eng_category['id']}, 名称={software_eng_category['name']}")
            return software_eng_category['id']
        else:
            print("\n未找到软件工程师相关分类")
    
    return 33  # 默认ID，从之前的查询中得知

def test_careers_api(category_id=None):
    """测试职业API"""
    print("\n===== 测试职业API =====")
    
    # 测试 /careers 端点
    print("\n1. 测试 /careers 端点 (分页参数)")
    careers_result = check_endpoint(f'{BASE_URL}/api/v1/careers', {'skip': 0, 'limit': 10})
    
    # 测试特定分类的职业
    if category_id:
        print(f"\n2. 测试 /careers/category/{category_id} 端点")
        category_careers_result = check_endpoint(f'{BASE_URL}/api/v1/careers/category/{category_id}')
        
        print(f"\n3. 测试 /api/v1/career-categories/{category_id} 端点")
        category_result = check_endpoint(f'{BASE_URL}/api/v1/career-categories/{category_id}')
        
        # 前端实际使用的API格式查看
        print(f"\n4. 测试前端使用的URL格式")
        frontend_result = check_endpoint(f'{BASE_URL}/api/v1/careers/category/{category_id}', 
                                        {'limit': 50, 'offset': 0})
        
        if frontend_result['status'] == 200:
            # 输出返回数据的字段
            data = frontend_result['data']
            if isinstance(data, list) and len(data) > 0:
                print("\n返回数据的第一条记录字段:")
                for key, value in data[0].items():
                    value_type = type(value).__name__
                    value_preview = str(value)[:50] + '...' if len(str(value)) > 50 else str(value)
                    print(f"  {key} ({value_type}): {value_preview}")
            elif isinstance(data, dict) and 'items' in data and len(data['items']) > 0:
                print("\n返回数据的第一条记录字段:")
                for key, value in data['items'][0].items():
                    value_type = type(value).__name__
                    value_preview = str(value)[:50] + '...' if len(str(value)) > 50 else str(value)
                    print(f"  {key} ({value_type}): {value_preview}")
    
    # 测试错误的URL格式
    print("\n5. 测试错误的URL格式")
    wrong_url_result = check_endpoint(f'{BASE_URL}/api/v1/careers/category/33/recursive')

def test_frontend_url_format():
    """测试前端URL格式"""
    print("\n===== 测试前端URL格式 =====")
    
    # 前端使用的URL格式
    # 从CareerLibrary.vue中发现的URL
    print("\n测试CareerLibrary.vue中使用的URL格式:")
    url = f'{BASE_URL}/api/v1/careers/category/33'
    params = {'limit': 50, 'offset': 0}
    
    print(f"URL: {url}")
    print(f"参数: {params}")
    
    result = check_endpoint(url, params)
    
    # 尝试备用URL
    print("\n尝试不同的URL格式:")
    alt_urls = [
        f'{BASE_URL}/api/v1/careers?category_id=33',
        f'{BASE_URL}/api/v1/career-categories/33/careers',
        f'{BASE_URL}/api/v1/careers'
    ]
    
    for alt_url in alt_urls:
        print(f"\n尝试: {alt_url}")
        alt_result = check_endpoint(alt_url)

def main():
    """主函数"""
    # 测试认证
    print("===== 测试认证 =====")
    if TOKEN:
        print(f"使用token: {TOKEN[:10]}...{TOKEN[-10:]}")
        auth_result = check_endpoint(f'{BASE_URL}/api/v1/users/me')
        
        if auth_result['status'] != 200:
            print("认证失败，但将继续测试API")
        else:
            print("认证成功")
    else:
        print("未提供token，将以未认证方式测试API")
    
    # 根据命令行参数确定执行哪些测试
    if len(sys.argv) > 1:
        if 'category' in sys.argv:
            category_id = test_category_api()
        if 'careers' in sys.argv:
            test_careers_api(33)  # 使用默认分类ID
        if 'frontend' in sys.argv:
            test_frontend_url_format()
    else:
        # 默认执行所有测试
        category_id = test_category_api()
        test_careers_api(category_id)
        test_frontend_url_format()

if __name__ == "__main__":
    main() 