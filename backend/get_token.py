import requests
import json
from app.core.config import settings

def get_token():
    """获取访问令牌"""
    url = "http://localhost:8000/api/v1/auth/login"
    data = {
        "username": settings.FIRST_SUPERUSER,
        "password": settings.FIRST_SUPERUSER_PASSWORD
    }
    
    try:
        response = requests.post(url, data=data)
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"访问令牌: {token_data['access_token']}")
            print(f"令牌类型: {token_data['token_type']}")
            
            # 保存令牌到文件
            with open("token.json", "w") as f:
                json.dump(token_data, f, indent=2)
            print("令牌已保存到 token.json 文件")
            
            return token_data["access_token"]
        else:
            print(f"获取令牌失败: {response.text}")
            
            # 尝试使用 OAuth2 表单格式
            form_data = {
                "username": settings.FIRST_SUPERUSER,
                "password": settings.FIRST_SUPERUSER_PASSWORD
            }
            response = requests.post(url, data=form_data)
            print(f"尝试 OAuth2 表单格式，状态码: {response.status_code}")
            
            if response.status_code == 200:
                token_data = response.json()
                print(f"访问令牌: {token_data['access_token']}")
                print(f"令牌类型: {token_data['token_type']}")
                
                # 保存令牌到文件
                with open("token.json", "w") as f:
                    json.dump(token_data, f, indent=2)
                print("令牌已保存到 token.json 文件")
                
                return token_data["access_token"]
            else:
                print(f"获取令牌失败: {response.text}")
                return None
    except Exception as e:
        print(f"发生错误: {e}")
        return None

if __name__ == "__main__":
    get_token() 