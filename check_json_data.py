import mysql.connector
import json
import sys

# 数据库连接配置
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06" 
DB_PORT = 3306

def check_json_data():
    """检查recommendation_sessions表中的JSON数据"""
    conn = None
    try:
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
        
        # 查询包含JSON数据的会话记录
        cursor.execute("""
            SELECT session_id, user_id, recommendations_data
            FROM recommendation_sessions
            WHERE recommendations_data IS NOT NULL
            ORDER BY created_at DESC
        """)
        
        sessions = cursor.fetchall()
        print(f"找到 {len(sessions)} 条包含JSON数据的会话记录")
        
        for session in sessions:
            session_id = session['session_id']
            user_id = session['user_id']
            
            try:
                # 解析JSON数据
                data = json.loads(session['recommendations_data'])
                recommendations = data.get('recommendations', [])
                
                print(f"\n会话ID: {session_id}")
                print(f"用户ID: {user_id}")
                print(f"推荐数量: {len(recommendations)}")
                
                # 显示每条推荐的详细信息
                for i, rec in enumerate(recommendations):
                    print(f"\n  推荐 #{i+1}: {rec['title']} (匹配分数: {rec['match_score']})")
                    
                    # 显示匹配原因
                    match_reasons = rec['deepseek_analysis']['match_reasons']
                    if match_reasons:
                        print(f"  匹配原因 ({len(match_reasons)}):")
                        for reason in match_reasons:
                            print(f"    - {reason}")
                    else:
                        print("  没有匹配原因")
                    
                    # 显示技能分析
                    skills = rec['deepseek_analysis']['skills_analysis']
                    print(f"  匹配技能: {', '.join(skills['matched_skills']) if skills['matched_skills'] else '无'}")
                    print(f"  缺失技能: {', '.join(skills['missing_skills']) if skills['missing_skills'] else '无'}")
                    
                    # 显示职业潜力
                    potential = rec['deepseek_analysis']['career_potential']
                    print(f"  职业潜力: {potential['growth_potential']}")
                    print(f"  发展前景: {potential['growth_prospects']}")
                    advantage_points = potential['advantage_points']
                    if advantage_points:
                        print(f"  优势点 ({len(advantage_points)}):")
                        for point in advantage_points:
                            print(f"    - {point}")
                    else:
                        print("  没有优势点数据")
                
            except Exception as e:
                print(f"解析会话 {session_id} 的JSON数据失败: {e}")
        
        # 关闭连接
        cursor.close()
        conn.close()
        print("\n数据库连接已关闭")
        
    except Exception as e:
        print(f"错误: {e}")
        if conn and conn.is_connected():
            conn.close()
            print("数据库连接已关闭")
        sys.exit(1)

if __name__ == "__main__":
    check_json_data() 