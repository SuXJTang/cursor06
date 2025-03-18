from app.models.user_profile import UserProfile
from app.models.user import User
from app.db.session import SessionLocal
import json
import traceback

# 创建数据库会话
db = SessionLocal()

try:
    # 查询admin11用户
    user = db.query(User).filter(User.username == 'admin11').first()
    print(f"User exists: {user is not None}")
    
    if user:
        print(f"User ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        
        # 查询用户个人档案
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        print(f"Profile exists: {profile is not None}")
        
        if profile:
            print("\n===== 用户档案数据 =====")
            print(f"ID: {profile.id}")
            print(f"User ID: {profile.user_id}")
            print(f"Full Name: {profile.full_name}")
            print(f"Bio: {profile.bio}")
            print(f"Avatar URL: {profile.avatar_url}")
            
            # 检查JSON字段 - 技能
            try:
                skills = json.loads(profile.skills) if isinstance(profile.skills, str) else profile.skills
                print(f"\nSkills: {json.dumps(skills, indent=2, ensure_ascii=False)}")
            except Exception as e:
                print(f"Error parsing skills: {str(e)}")
                print(f"Raw skills data: {profile.skills}")
            
            # 检查JSON字段 - 兴趣
            try:
                interests = json.loads(profile.interests) if isinstance(profile.interests, str) else profile.interests
                print(f"\nInterests: {json.dumps(interests, indent=2, ensure_ascii=False)}")
            except Exception as e:
                print(f"Error parsing interests: {str(e)}")
                print(f"Raw interests data: {profile.interests}")
            
            # 检查JSON字段 - 职业兴趣
            try:
                career_interests = json.loads(profile.career_interests) if isinstance(profile.career_interests, str) else profile.career_interests
                print(f"\nCareer Interests: {json.dumps(career_interests, indent=2, ensure_ascii=False)}")
            except Exception as e:
                print(f"Error parsing career_interests: {str(e)}")
                print(f"Raw career_interests data: {profile.career_interests}")
            
            # 检查JSON字段 - 性格特征
            try:
                personality_traits = json.loads(profile.personality_traits) if isinstance(profile.personality_traits, str) else profile.personality_traits
                print(f"\nPersonality Traits: {json.dumps(personality_traits, indent=2, ensure_ascii=False)}")
            except Exception as e:
                print(f"Error parsing personality_traits: {str(e)}")
                print(f"Raw personality_traits data: {profile.personality_traits}")
            
            # 检查JSON字段 - 工作风格
            try:
                work_style = json.loads(profile.work_style) if isinstance(profile.work_style, str) else profile.work_style
                print(f"\nWork Style: {json.dumps(work_style, indent=2, ensure_ascii=False)}")
            except Exception as e:
                print(f"Error parsing work_style: {str(e)}")
                print(f"Raw work_style data: {profile.work_style}")
        else:
            print("\n===== 未找到用户档案 =====")
    else:
        print("\n===== 未找到用户 =====")
        
except Exception as e:
    print(f"Error: {str(e)}")
    traceback.print_exc()
finally:
    db.close() 