import csv
import json
import requests
import time
import argparse

# 配置信息
BASE_URL = "http://127.0.0.1:8000/api/v1"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI1MTc2OTcsInN1YiI6IjEifQ.IwfUKS712Q72OOIZsgTkZFZcEdyf6_EN-5pLpnHaScM"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def create_career(career_data):
    """创建职业数据"""
    try:
        response = requests.post(
            f"{BASE_URL}/careers/",
            headers=HEADERS,
            json=career_data
        )
        
        if response.status_code == 200 or response.status_code == 201:
            print(f"成功创建职业: {career_data['title']}")
            return response.json()
        else:
            print(f"创建职业失败: {career_data['title']}, 状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            return None
    except Exception as e:
        print(f"创建职业时发生错误: {str(e)}")
        return None

def parse_list(value):
    """解析包含列表的字段"""
    if not value:
        return []
    try:
        return json.loads(value.replace("'", "\""))
    except:
        return [item.strip() for item in value.split(',')]

def parse_dict(value):
    """解析包含字典的字段"""
    if not value:
        return {}
    try:
        return json.loads(value.replace("'", "\""))
    except:
        return {}

def main():
    """主函数"""
    # 设置命令行参数
    parser = argparse.ArgumentParser(description='从CSV文件批量导入职业数据')
    parser.add_argument('csv_file', help='CSV文件路径')
    parser.add_argument('--delay', type=float, default=0.5, help='请求之间的延迟时间(秒)')
    args = parser.parse_args()
    
    csv_file = args.csv_file
    delay = args.delay
    
    print(f"开始从CSV文件 {csv_file} 导入职业数据...")
    
    # 统计
    success_count = 0
    fail_count = 0
    
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                # 处理可能的列表和字典字段
                career_data = {
                    "title": row.get('title', ''),
                    "description": row.get('description', ''),
                    "category_id": int(row.get('category_id', 0)),
                    "required_skills": parse_list(row.get('required_skills', '')),
                    "education_required": row.get('education_required', ''),
                    "experience_required": row.get('experience_required', ''),
                    "career_path": parse_list(row.get('career_path', '')),
                    "salary_range": parse_dict(row.get('salary_range', '')),
                    "future_prospect": row.get('future_prospect', '')
                }
                
                result = create_career(career_data)
                
                if result:
                    success_count += 1
                else:
                    fail_count += 1
                
                # 延迟一下，避免请求过快
                time.sleep(delay)
                
    except Exception as e:
        print(f"处理CSV文件时发生错误: {str(e)}")
    
    print(f"\n导入完成! 成功: {success_count}, 失败: {fail_count}")

if __name__ == "__main__":
    main() 