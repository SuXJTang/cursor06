import requests
import json

# 测试账号信息
username = 'admin@example.com'
password = 'admin123'
career_ids = [
    '0001e702-e4a4-42c5-bad0-79363f0b1bd6',
    '0004ac55-3178-445c-86b2-648e2a09192d'
]
# 后端服务地址 - 尝试使用端口8000
base_url = 'http://localhost:8000'

# 登录获取token
def login():
    login_url = f'{base_url}/api/v1/auth/login'
    # 使用表单数据格式，而不是JSON格式
    login_data = {'username': username, 'password': password}
    print(f"尝试登录URL: {login_url}")
    print(f"登录数据: {login_data}")
    
    try:
        # 使用form-data格式而不是json格式
        response = requests.post(login_url, data=login_data)
        print(f'登录状态: {response.status_code}')
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"登录成功，响应: {token_data}")
            access_token = token_data.get('access_token')
            if not access_token:
                print("响应中没有access_token字段")
            return access_token
        else:
            print(f'登录响应: {response.text}')
    except Exception as e:
        print(f"登录请求错误: {str(e)}")
    return None

# 收藏职业
def add_favorite(token, career_id):
    fav_url = f'{base_url}/api/v1/careers/{career_id}/favorite'
    headers = {'Authorization': f'Bearer {token}'}
    print(f"尝试添加收藏URL: {fav_url}")
    print(f"请求头: {headers}")
    
    try:
        response = requests.post(fav_url, headers=headers)
        print(f'收藏职业 {career_id}: {response.status_code}')
        if response.status_code >= 400:
            print(f'收藏错误响应: {response.text}')
        return response.status_code
    except Exception as e:
        print(f"添加收藏请求错误: {str(e)}")
        return 500

# 取消收藏
def remove_favorite(token, career_id):
    fav_url = f'{base_url}/api/v1/careers/{career_id}/favorite'
    headers = {'Authorization': f'Bearer {token}'}
    print(f"尝试取消收藏URL: {fav_url}")
    print(f"请求头: {headers}")
    
    try:
        response = requests.delete(fav_url, headers=headers)
        print(f'取消收藏 {career_id}: {response.status_code}')
        if response.status_code >= 400:
            print(f'取消收藏错误响应: {response.text}')
        return response.status_code
    except Exception as e:
        print(f"取消收藏请求错误: {str(e)}")
        return 500

# 获取收藏列表
def get_favorites(token):
    fav_url = f'{base_url}/api/v1/careers/user/favorites'
    headers = {'Authorization': f'Bearer {token}'}
    print(f"尝试获取收藏列表URL: {fav_url}")
    print(f"请求头: {headers}")
    
    try:
        response = requests.get(fav_url, headers=headers)
        print(f'获取收藏列表: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f"收藏列表响应: {json.dumps(data, ensure_ascii=False, indent=2)[:300]}...")
            return data
        else:
            print(f'获取收藏列表错误响应: {response.text}')
    except Exception as e:
        print(f"获取收藏列表请求错误: {str(e)}")
    return []

# 执行测试
print("开始收藏功能测试")
print("=================================")
token = login()
if token:
    print('登录成功, 开始测试...')
    print(f'获取的令牌: {token[:20]}...' if token and len(token) > 20 else token)
    
    # 获取当前收藏列表
    print('\n检查当前收藏状态:')
    current_favorites = get_favorites(token)
    if isinstance(current_favorites, list):
        current_count = len(current_favorites)
    else:
        current_count = len(current_favorites.get('careers', []))
    print(f'当前收藏数量: {current_count}')
    
    # 添加两个收藏
    print('\n添加两个职业到收藏:')
    for career_id in career_ids:
        add_favorite(token, career_id)
    
    # 再次获取收藏列表
    print('\n收藏后状态:')
    after_add_favorites = get_favorites(token)
    if isinstance(after_add_favorites, list):
        add_count = len(after_add_favorites)
        add_ids = [item.get('id') for item in after_add_favorites]
    else:
        add_count = len(after_add_favorites.get('careers', []))
        add_ids = [item.get('id') for item in after_add_favorites.get('careers', [])]
    print(f'添加后收藏数量: {add_count}')
    print(f'收藏的职业ID: {add_ids}')
    
    # 删除一个收藏
    print('\n删除第一个收藏的职业:')
    remove_favorite(token, career_ids[0])
    
    # 最终状态
    print('\n最终收藏状态:')
    final_favorites = get_favorites(token)
    if isinstance(final_favorites, list):
        final_count = len(final_favorites)
        final_ids = [item.get('id') for item in final_favorites]
    else:
        final_count = len(final_favorites.get('careers', []))
        final_ids = [item.get('id') for item in final_favorites.get('careers', [])]
    print(f'最终收藏数量: {final_count}')
    print(f'最终收藏的职业ID: {final_ids}')
    
    print('\n测试完成')
else:
    print('登录失败，无法进行测试') 