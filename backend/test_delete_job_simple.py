import requests
import mysql.connector

# 直接从数据库获取岗位信息
print("===== 步骤1: 从数据库获取岗位信息 =====")
try:
    # 连接数据库
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="cursor06"
    )
    cursor = conn.cursor(dictionary=True)
    
    # 获取所有岗位
    cursor.execute("SELECT * FROM jobs ORDER BY id DESC LIMIT 1")
    job = cursor.fetchone()
    
    if job:
        job_id = job["id"]
        job_title = job["title"]
        print(f"找到岗位: {job_title} (ID: {job_id})")
        
        # 2. 登录获取令牌
        print("\n===== 步骤2: 登录获取令牌 =====")
        login_url = "http://127.0.0.1:8000/api/v1/auth/login"
        login_data = {"username": "admin@example.com", "password": "admin123"}
        login_response = requests.post(login_url, data=login_data)
        print(f"登录状态码: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data["access_token"]
            print(f"获取到的令牌: {token[:20]}...")
            
            # 3. 删除岗位
            print("\n===== 步骤3: 删除岗位 =====")
            delete_url = f"http://127.0.0.1:8000/api/v1/jobs/{job_id}"
            headers = {
                "Authorization": f"Bearer {token}"
            }
            
            delete_response = requests.delete(delete_url, headers=headers)
            print(f"删除岗位状态码: {delete_response.status_code}")
            
            if delete_response.status_code == 200 or delete_response.status_code == 204:
                print(f"岗位 {job_title} (ID: {job_id}) 已成功删除!")
                
                # 4. 验证岗位已删除
                print("\n===== 步骤4: 验证岗位已删除 =====")
                cursor.execute(f"SELECT * FROM jobs WHERE id = {job_id}")
                deleted_job = cursor.fetchone()
                
                if deleted_job is None:
                    print(f"验证成功: 岗位 ID {job_id} 已不存在")
                    print("\n删除岗位功能测试成功!")
                else:
                    print(f"验证失败: 岗位 ID {job_id} 仍然存在")
                    print("\n删除岗位功能测试失败!")
            else:
                print(f"删除岗位失败: {delete_response.text}")
        else:
            print(f"登录失败: {login_response.text}")
    else:
        print("没有找到可删除的岗位，请先添加岗位")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"数据库操作出错: {str(e)}") 