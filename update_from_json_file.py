import mysql.connector
import json
import os
import sys
import uuid
from datetime import datetime

# 数据库连接配置
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06" 
DB_PORT = 3306

# JSON文件路径
JSON_FILE_PATH = "backend/data/recommendations/user_1_recommendations.json"

def update_from_json_file():
    """从JSON文件加载推荐数据到recommendation_sessions表"""
    conn = None
    try:
        # 检查JSON文件是否存在
        if not os.path.exists(JSON_FILE_PATH):
            print(f"错误: JSON文件不存在: {JSON_FILE_PATH}")
            return
        
        # 读取JSON文件
        print(f"读取JSON文件: {JSON_FILE_PATH}")
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
            recommendations_data = json.load(file)
        
        print(f"读取到 {len(recommendations_data)} 条推荐记录")
        
        # 连接到数据库
        print("正在连接到数据库...")
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT
        )
        
        print(f"成功连接到数据库: {DB_NAME}")
        
        # 创建游标
        cursor = conn.cursor(dictionary=True)
        
        # 为用户ID=1创建一个新会话
        user_id = 1
        session_id = f"rec_{uuid.uuid4().hex[:10]}_{int(datetime.now().timestamp())}"
        
        print(f"为用户ID {user_id} 创建新会话: {session_id}")
        
        # 将推荐按match_score排序
        recommendations_data.sort(key=lambda x: x.get('match_score', 0), reverse=True)
        
        # 准备会话数据
        json_recommendations = []
        
        for rank, rec in enumerate(recommendations_data, 1):
            career_id = rec.get('id')
            title = rec.get('title', '未知职业')
            match_score = rec.get('match_score', 0)
            
            # 创建推荐项
            recommendation_item = {
                "career_id": career_id,
                "title": title,
                "match_score": match_score,
                "rank": rank,
                "deepseek_analysis": {
                    "match_reasons": rec.get('match_reasons', []),
                    "skills_analysis": rec.get('skills_analysis', {"matched_skills": [], "missing_skills": []}),
                    "career_potential": rec.get('career_potential', {
                        "growth_prospects": "暂无数据",
                        "growth_potential": 0.5,
                        "advantage_points": []
                    }),
                    "detailed_analysis": rec.get('detailed_analysis', f"暂无针对职业{career_id}的分析")
                }
            }
            
            json_recommendations.append(recommendation_item)
            print(f"添加推荐: 排名 {rank}, 职业 {title} (匹配分数: {match_score})")
        
        # 构建完整的JSON数据
        session_data = {
            "session_id": session_id,
            "recommendations": json_recommendations
        }
        
        # 检查会话是否已存在
        cursor.execute(
            "SELECT COUNT(*) as count FROM recommendation_sessions WHERE session_id = %s",
            (session_id,)
        )
        result = cursor.fetchone()
        session_exists = result['count'] > 0
        
        if session_exists:
            print(f"会话 {session_id} 已存在，更新记录")
            cursor.execute(
                "UPDATE recommendation_sessions SET recommendations_data = %s WHERE session_id = %s",
                (json.dumps(session_data), session_id)
            )
        else:
            print(f"会话 {session_id} 不存在，创建新记录")
            # 插入会话记录
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            cursor.execute(
                """
                INSERT INTO recommendation_sessions 
                (session_id, user_id, status, progress, created_at, updated_at, recommendations_data)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (session_id, user_id, 'completed', 100, now, now, json.dumps(session_data))
            )
        
        # 提交事务
        conn.commit()
        print(f"会话数据已保存到数据库，会话ID: {session_id}")
        
        # 关闭连接
        cursor.close()
        conn.close()
        print("数据库连接已关闭")
        
    except Exception as e:
        print(f"错误: {e}")
        if conn and conn.is_connected():
            conn.close()
            print("数据库连接已关闭")
        sys.exit(1)

if __name__ == "__main__":
    update_from_json_file() 