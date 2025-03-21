import requests
import json

# 设置令牌和请求头
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

# 获取根分类
def get_root_categories():
    url = "http://127.0.0.1:8000/api/v1/career-categories/roots?include_all_children=true"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        with open("root_categories.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Root categories saved to root_categories.json")
    else:
        print(f"Error: {response.status_code}, {response.text}")

# 获取分类的子分类
def get_subcategories(category_id):
    url = f"http://127.0.0.1:8000/api/v1/career-categories/{category_id}/subcategories"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        with open(f"subcategories_{category_id}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Subcategories for ID {category_id} saved to subcategories_{category_id}.json")
    else:
        print(f"Error: {response.status_code}, {response.text}")

# 获取指定分类下的职业信息
def get_careers_by_category(category_id):
    url = f"http://127.0.0.1:8000/api/v1/careers/category/{category_id}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        with open(f"careers_category_{category_id}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Careers for category ID {category_id} saved to careers_category_{category_id}.json")
    else:
        print(f"Error: {response.status_code}, {response.text}")

# 搜索职业
def search_careers(keyword):
    url = f"http://127.0.0.1:8000/api/v1/careers/search/?keyword={keyword}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        with open(f"search_results_{keyword}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Search results for '{keyword}' saved to search_results_{keyword}.json")
    else:
        print(f"Error: {response.status_code}, {response.text}")

if __name__ == "__main__":
    print("Getting career data...")
    
    # 获取根分类
    get_root_categories()
    
    # 获取技术/互联网分类的子分类
    get_subcategories(1)
    
    # 获取技术开发分类的子分类
    get_subcategories(32)
    
    # 获取技术开发分类下的职业
    get_careers_by_category(32)
    
    # 搜索软件工程师
    search_careers("软件工程师")
    
    print("Completed!") 