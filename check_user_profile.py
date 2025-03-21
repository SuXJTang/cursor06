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
        
        if not profile:
            # 创建新的用户档案
            new_profile = UserProfile(
                user_id=user.id,
                full_name='管理员11',
                bio='这是admin11的个人简介',
                skills=json.dumps(['Python', 'FastAPI', 'Vue']),
                interests=json.dumps(['编程', '人工智能']),
                career_interests=json.dumps({
                    'direction': ['全栈开发', 'AI开发'],
                    'industry': ['互联网', '教育']
                }),
                personality_traits=json.dumps({
                    'mbtiType': 'INTJ',
                    'coreAbilities': ['分析能力', '逻辑思维'],
                    'workingStyle': ['专注', '自律']
                }),
                work_style=json.dumps({
                    'schedule': ['朝九晚五', '弹性工作'],
                    'overtime': '适度',
                    'benefits': ['职业发展', '健康保险']
                }),
                learning_style=json.dumps({
                    'languages': ['中文', '英语']
                }),
                avatar_url='https://example.com/avatar.jpg'
            )
            
            # 将新档案添加到数据库
            db.add(new_profile)
            db.commit()
            print('新档案已创建')
            
            # 重新查询以验证
            profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
            print(f'新档案检查: {profile is not None}')
        else:
            # 更新现有档案
            profile.full_name = '管理员11'
            profile.bio = '这是admin11的个人简介'
            profile.skills = json.dumps(['Python', 'FastAPI', 'Vue'])
            profile.interests = json.dumps(['编程', '人工智能'])
            profile.career_interests = json.dumps({
                'direction': ['全栈开发', 'AI开发'],
                'industry': ['互联网', '教育']
            })
            profile.personality_traits = json.dumps({
                'mbtiType': 'INTJ',
                'coreAbilities': ['分析能力', '逻辑思维'],
                'workingStyle': ['专注', '自律']
            })
            profile.work_style = json.dumps({
                'schedule': ['朝九晚五', '弹性工作'],
                'overtime': '适度',
                'benefits': ['职业发展', '健康保险']
            })
            profile.learning_style = json.dumps({
                'languages': ['中文', '英语']
            })
            profile.avatar_url = 'https://example.com/avatar.jpg'
            
            # 提交更新
            db.commit()
            print('档案已更新')
    else:
        print('用户不存在，请先创建admin11用户')
        
finally:
    # 关闭数据库会话
    db.close() 