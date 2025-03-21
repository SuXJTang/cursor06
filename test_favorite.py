import requests
import json

# 配置信息
BASE_URL = "http://localhost:8000/api/v1"
# 使用用户提供的token
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1NTAzMzYsInN1YiI6IjEifQ.0PlNYALurwyaOWZnqJD9pqDsxuyl3PauyulnpRNX2dU"
CAREER_ID = 476  # 选择全栈工程师(ID = 476)作为测试对象

# 获取可用的职业ID
def get_available_career_id():
    print("尝试获取可用的职业ID...")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    try:
        # 尝试获取职业列表
        response = requests.get(f"{BASE_URL}/careers/", headers=headers)
        print(f"获取职业列表状态码: {response.status_code}")
        
        if response.ok:
            try:
                careers = response.json()
                if careers and isinstance(careers, list) and len(careers) > 0:
                    first_career = careers[0]
                    career_id = first_career.get('id')
                    print(f"找到可用职业: {first_career.get('name')} (ID: {career_id})")
                    return career_id
                else:
                    print("职业列表为空")
            except json.JSONDecodeError:
                print(f"解析职业列表失败: {response.text}")
        else:
            print(f"获取职业列表失败: {response.text}")
            
        # 尝试获取职业分类
        print("尝试获取职业分类...")
        cat_response = requests.get(f"{BASE_URL}/career-categories/", headers=headers)
        print(f"获取职业分类状态码: {cat_response.status_code}")
        
        if cat_response.ok:
            try:
                categories = cat_response.json()
                if categories and isinstance(categories, list) and len(categories) > 0:
                    first_category = categories[0]
                    print(f"找到职业分类: {first_category.get('name')} (ID: {first_category.get('id')})")
                    
                    # 尝试获取该分类下的职业
                    category_id = first_category.get('id')
                    careers_response = requests.get(f"{BASE_URL}/careers/category/{category_id}", headers=headers)
                    print(f"获取分类职业状态码: {careers_response.status_code}")
                    
                    if careers_response.ok:
                        try:
                            category_careers = careers_response.json()
                            if category_careers and isinstance(category_careers, list) and len(category_careers) > 0:
                                first_career = category_careers[0]
                                career_id = first_career.get('id')
                                print(f"找到可用职业: {first_career.get('name')} (ID: {career_id})")
                                return career_id
                        except json.JSONDecodeError:
                            print(f"解析分类职业失败: {careers_response.text}")
            except json.JSONDecodeError:
                print(f"解析职业分类失败: {cat_response.text}")
                
    except Exception as e:
        print(f"获取职业ID时发生异常: {str(e)}")
    
    print("无法获取可用职业ID，将使用默认ID: 1")
    return CAREER_ID  # 默认ID

# 执行测试
def test_favorite_feature():
    print(f"使用提供的token: {TOKEN[:15]}...")
    headers = {"Authorization": f"Bearer {TOKEN}"}
    
    print("\n===== 职业收藏功能测试 =====")
    print(f"测试职业ID: {CAREER_ID} (全栈工程师)")
    
    # 1. 收藏职业
    print("\n1. 收藏职业测试")
    try:
        fav_response = requests.post(f"{BASE_URL}/careers/{CAREER_ID}/favorite", headers=headers)
        print(f"状态码: {fav_response.status_code}")
        print(f"响应: {fav_response.text}")
    except Exception as e:
        print(f"收藏职业异常: {str(e)}")
    
    # 2. 检查是否收藏
    print("\n2. 检查收藏状态测试")
    try:
        check_response = requests.get(f"{BASE_URL}/careers/{CAREER_ID}/is_favorite", headers=headers)
        print(f"状态码: {check_response.status_code}")
        print(f"响应: {check_response.text}")
    except Exception as e:
        print(f"检查收藏状态异常: {str(e)}")
    
    # 3. 获取收藏列表
    print("\n3. 获取收藏列表测试")
    try:
        list_response = requests.get(f"{BASE_URL}/careers/user/favorites", headers=headers)
        print(f"状态码: {list_response.status_code}")
        if list_response.ok:
            try:
                careers = list_response.json()
                if isinstance(careers, dict) and "careers" in careers:
                    careers_list = careers["careers"]
                    print(f"收藏职业数量: {len(careers_list)}")
                    for i, career in enumerate(careers_list[:3], 1):
                        print(f"  {i}. {career.get('title')} (ID: {career.get('id')})")
                    if len(careers_list) > 3:
                        print(f"  ...及其他 {len(careers_list)-3} 个职业")
                else:
                    print(f"收藏职业数量: {len(careers)}")
                    for i, career in enumerate(careers[:3], 1):
                        print(f"  {i}. {career.get('title')} (ID: {career.get('id')})")
                    if len(careers) > 3:
                        print(f"  ...及其他 {len(careers)-3} 个职业")
            except json.JSONDecodeError:
                print(f"响应不是有效的JSON: {list_response.text}")
        else:
            print(f"响应: {list_response.text}")
    except Exception as e:
        print(f"获取收藏列表异常: {str(e)}")
    
    # 4. 取消收藏
    print("\n4. 取消收藏测试")
    try:
        unfav_response = requests.delete(f"{BASE_URL}/careers/{CAREER_ID}/favorite", headers=headers)
        print(f"状态码: {unfav_response.status_code}")
        print(f"响应: {unfav_response.text}")
    except Exception as e:
        print(f"取消收藏异常: {str(e)}")
    
    # 5. 再次检查
    print("\n5. 再次检查收藏状态")
    try:
        check_again = requests.get(f"{BASE_URL}/careers/{CAREER_ID}/is_favorite", headers=headers)
        print(f"状态码: {check_again.status_code}")
        print(f"响应: {check_again.text}")
    except Exception as e:
        print(f"再次检查收藏状态异常: {str(e)}")

if __name__ == "__main__":
    test_favorite_feature() 