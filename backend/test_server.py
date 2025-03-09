import requests
import time

def test_server():
    url = "http://127.0.0.1:8001/api/v1/auth/login"
    data = {
        "username": "admin@example.com",
        "password": "admin123"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    print("Testing server connection...")
    try:
        response = requests.post(url, data=data, headers=headers)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # 等待服务器启动
    print("Waiting for server to start...")
    time.sleep(5)
    test_server() 