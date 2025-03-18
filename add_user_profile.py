from app.models.user_profile import UserProfile
from app.models.user import User
from app.db.session import SessionLocal
import json

# 创建数据库会话
db = SessionLocal()

try:
    # 查询admin11用户
    user = db.query(User).filter(User.username == 'admin11').first()
    print(f'User exists: {user is not None}')
    
    if user:
        print(f'User ID: {user.id}')
        
        # 查询用户个人档案
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        print(f'Profile exists: {profile is not None}')
        
        # 个人档案数据
        profile_data = {
            'user_id': user.id,
            'full_name': '管理员11',
            'bio': '这是admin11的个人简介',
            'skills': ['Python', 'FastAPI', 'Vue', 'TypeScript', 'React'],
            'interests': ['编程', '人工智能', '阅读', '音乐'],
            'career_interests': {
                'direction': ['全栈开发', 'AI开发'],
                'industry': ['互联网', '教育', '金融科技']
            },
            'personality_traits': {
                'mbtiType': 'INTJ',
                'coreAbilities': ['分析能力', '逻辑思维', '创新'],
                'workingStyle': ['专注', '自律', '团队合作']
            },
            'work_style': {
                'schedule': ['朝九晚五', '弹性工作'],
                'overtime': '适度',
                'benefits': ['职业发展', '健康保险', '带薪休假']
            },
            'learning_style': {
                'languages': ['中文', '英语', '日语初级']
            },
            'avatar_url': 'https://example.com/avatar.jpg',
            'education': '本科',
            'major': '计算机科学',
            'experience_years': 5
        }
        
        if not profile:
            # 创建新的用户档案
            new_profile = UserProfile(
                user_id=profile_data['user_id'],
                full_name=profile_data['full_name'],
                bio=profile_data['bio'],
                skills=json.dumps(profile_data['skills']),
                interests=json.dumps(profile_data['interests']),
                career_interests=json.dumps(profile_data['career_interests']),
                personality_traits=json.dumps(profile_data['personality_traits']),
                work_style=json.dumps(profile_data['work_style']),
                learning_style=json.dumps(profile_data['learning_style']),
                avatar_url=profile_data['avatar_url'],
                education=profile_data['education'],
                major=profile_data['major'],
                experience_years=profile_data['experience_years']
            )
            
            # 将新档案添加到数据库
            db.add(new_profile)
            db.commit()
            print('✅ 新档案已创建成功！')
            
            # 重新查询以验证
            profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
            print(f'验证新档案: {profile is not None}')
        else:
            # 更新现有档案
            profile.full_name = profile_data['full_name']
            profile.bio = profile_data['bio']
            profile.skills = json.dumps(profile_data['skills'])
            profile.interests = json.dumps(profile_data['interests'])
            profile.career_interests = json.dumps(profile_data['career_interests'])
            profile.personality_traits = json.dumps(profile_data['personality_traits'])
            profile.work_style = json.dumps(profile_data['work_style'])
            profile.learning_style = json.dumps(profile_data['learning_style'])
            profile.avatar_url = profile_data['avatar_url']
            profile.education = profile_data['education']
            profile.major = profile_data['major']
            profile.experience_years = profile_data['experience_years']
            
            # 提交更新
            db.commit()
            print('✅ 档案已更新成功！')
    else:
        print('❌ 用户不存在，请先创建admin11用户')
        
finally:
    # 关闭数据库会话
    db.close()
    
print('\n现在您可以刷新前端页面，查看用户的个人资料信息。') 