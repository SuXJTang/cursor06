import requests
import json

# 设置令牌和请求头
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json"
}

# 获取软件工程师分类下的职业信息
def get_software_engineer_careers():
    url = "http://127.0.0.1:8000/api/v1/careers/category/33"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        with open("software_engineer_careers.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Software engineer careers saved to software_engineer_careers.json")
        
        # 打印职业数据
        if data["total"] > 0:
            print(f"\n找到 {data['total']} 个软件工程师相关职业:")
            for i, career in enumerate(data["careers"], 1):
                print(f"{i}. {career['name']}: {career['description']}")
        else:
            print("\n未找到软件工程师相关职业数据")
    else:
        print(f"Error: {response.status_code}, {response.text}")

if __name__ == "__main__":
    print("Getting software engineer career data...")
    get_software_engineer_careers() 