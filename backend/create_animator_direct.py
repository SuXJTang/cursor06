import requests
import json

def create_career(token, career_data):
    """
    直接使用API创建职业
    """
    url = "http://127.0.0.1:8000/api/v1/careers/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 确保移除average_salary和job_outlook字段
    if "average_salary" in career_data:
        del career_data["average_salary"]
    if "job_outlook" in career_data:
        del career_data["job_outlook"]
    
    response = requests.post(url, headers=headers, json=career_data)
    
    if response.status_code == 200 or response.status_code == 201:
        print(f"成功创建职业: {career_data['title']}")
        return response.json()
    else:
        print(f"创建职业失败: {response.status_code}")
        print(response.text)
        return None

def get_careers(token):
    """
    获取所有职业
    """
    url = "http://127.0.0.1:8000/api/v1/careers/"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"获取职业失败: {response.status_code}")
        print(response.text)
        return None

def main():
    # 令牌
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIxMTc2NzgsInN1YiI6IjEifQ.T9-q6HvwwhFnMQdw9Z4z9FWL8KXJPXOolbV_FFXhrqg"
    
    # 动漫设计师数据 - 不包含average_salary字段
    animator_data = {
        "title": "动漫设计师",
        "description": "动漫设计师负责创造和发展动画作品中的角色、场景和视觉元素。他们将故事和概念转化为视觉形象，制作分镜脚本，设计角色模型和动画序列，确保整体风格的一致性和艺术品质。",
        "required_skills": ["Photoshop", "Illustrator", "绘画基础", "角色设计", "故事板绘制", "动画原理", "色彩理论"],
        "education_required": "本科",
        "experience_required": "1-3年",
        "salary_range": {
            "min": "8k",
            "max": "15k",
            "currency": "CNY",
            "period": "monthly"
        },
        "future_prospect": "稳定增长",
        "related_majors": ["动画学", "视觉艺术", "美术设计", "插画设计"],
        "work_activities": ["角色设计", "场景设计", "分镜头设计", "动画制作", "原画绘制"],
        "category_id": 2  # 假设2是艺术创意分类的ID
    }
    
    # 游戏美术设计师数据 - 不包含average_salary字段
    game_artist_data = {
        "title": "游戏美术设计师",
        "description": "游戏美术设计师负责创建游戏中的视觉元素，包括角色、环境、UI等。他们将概念转化为数字艺术作品，确保游戏的视觉风格符合项目需求，并与开发团队合作实现艺术资源的游戏化。",
        "required_skills": ["3D建模", "材质贴图", "角色设计", "场景设计", "Unity/Unreal引擎", "Photoshop", "Zbrush"],
        "education_required": "本科",
        "experience_required": "2-4年",
        "salary_range": {
            "min": "10k",
            "max": "20k",
            "currency": "CNY",
            "period": "monthly"
        },
        "future_prospect": "快速增长",
        "related_majors": ["游戏设计", "数字媒体艺术", "计算机图形学", "动画学"],
        "work_activities": ["概念设计", "3D建模", "UV贴图", "材质绘制", "动画制作", "特效设计"],
        "category_id": 2  # 假设2是艺术创意分类的ID
    }
    
    # 获取职业分类列表
    career_result = get_careers(token)
    if career_result:
        print(f"当前已有 {career_result['total']} 个职业")
        
        # 检查是否已存在同名职业
        existing_titles = [career["title"] for career in career_result["careers"]]
        print(f"现有职业: {existing_titles}")
        
        # 如果不存在动漫设计师，则创建
        if "动漫设计师" not in existing_titles:
            created_animator = create_career(token, animator_data)
            if created_animator:
                print(f"创建动漫设计师成功! ID: {created_animator['id']}")
        else:
            print("动漫设计师已存在，跳过创建")
            
        # 如果不存在游戏美术设计师，则创建
        if "游戏美术设计师" not in existing_titles:
            created_game_artist = create_career(token, game_artist_data)
            if created_game_artist:
                print(f"创建游戏美术设计师成功! ID: {created_game_artist['id']}")
        else:
            print("游戏美术设计师已存在，跳过创建")
    
    # 最后再次获取所有职业进行确认
    print("\n获取更新后的职业列表:")
    updated_careers = get_careers(token)
    if updated_careers:
        print(f"当前共有 {updated_careers['total']} 个职业")
        for career in updated_careers["careers"]:
            print(f"- {career['title']}: {career['future_prospect']}")

if __name__ == "__main__":
    main() 