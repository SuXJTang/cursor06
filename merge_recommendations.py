import mysql.connector
import json
import sys
import time
from collections import defaultdict

# 数据库连接配置
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06"
DB_PORT = 3306

# 最大重试次数
MAX_RETRIES = 3

def merge_recommendations():
    """将career_recommendations表中的数据合并到recommendation_sessions表的JSON字段中"""
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
        
        # 1. 检查recommendation_sessions表是否有recommendations_data字段
        print("检查recommendation_sessions表结构...")
        cursor.execute("SHOW COLUMNS FROM recommendation_sessions LIKE 'recommendations_data'")
        column_exists = cursor.fetchone()
        
        # 如果字段不存在，添加它
        if not column_exists:
            print("添加recommendations_data字段到recommendation_sessions表...")
            cursor.execute("ALTER TABLE recommendation_sessions ADD COLUMN recommendations_data JSON NULL")
            conn.commit()
            print("字段添加成功")
        else:
            print("recommendations_data字段已存在")
        
        # 2. 获取所有推荐数据，按会话ID分组
        print("获取所有career_recommendations记录...")
        cursor.execute("""
            SELECT COUNT(*) as count 
            FROM career_recommendations
        """)
        result = cursor.fetchone()
        total_records = result['count']
        print(f"找到 {total_records} 条推荐记录")
        
        if total_records == 0:
            print("没有找到任何推荐记录，退出程序")
            return
        
        print("查询有效的推荐记录...")
        cursor.execute("""
            SELECT cr.id, cr.user_id, cr.career_id, cr.match_score, cr.match_reasons, 
                   cr.skills_analysis, cr.career_potential, cr.detailed_analysis,
                   cr.recommendation_session_id, cr.recommendation_rank
            FROM career_recommendations cr
            WHERE cr.recommendation_session_id IS NOT NULL
            ORDER BY cr.recommendation_session_id, cr.recommendation_rank
        """)
        
        all_recommendations = cursor.fetchall()
        print(f"获取到 {len(all_recommendations)} 条有效的推荐记录")
        
        # 按会话ID分组
        print("按会话ID分组推荐数据...")
        grouped_recommendations = defaultdict(list)
        
        # 查询所有职业的标题
        print("获取所有职业标题...")
        career_titles = {}
        cursor.execute("SELECT id, title FROM careers")
        for career in cursor.fetchall():
            career_titles[career['id']] = career['title']
        print(f"获取到 {len(career_titles)} 个职业标题")
        
        for rec in all_recommendations:
            session_id = rec['recommendation_session_id']
            if session_id:
                # 获取职业标题
                if rec['career_id'] and rec['career_id'] in career_titles:
                    title = career_titles[rec['career_id']]
                    print(f"使用缓存的职业标题: {title} (ID: {rec['career_id']})")
                else:
                    title = "未知职业"
                    print(f"未找到职业标题 (ID: {rec['career_id']})")
                
                # 添加标题字段
                rec['title'] = title
                grouped_recommendations[session_id].append(rec)
        
        print(f"按会话ID分组后，共有 {len(grouped_recommendations)} 个会话")
        
        # 如果没有有效的会话，退出程序
        if not grouped_recommendations:
            print("没有找到有效的会话记录，退出程序")
            return
        
        # 3. 为每个会话构建JSON数据并更新
        print(f"开始处理 {len(grouped_recommendations)} 个推荐会话...")
        session_count = 0
        
        # 收集所有会话数据，然后批量更新
        all_session_data = []
        
        for session_id, recommendations in grouped_recommendations.items():
            print(f"\n处理会话 {session_id}，包含 {len(recommendations)} 条推荐...")
            # 构建JSON数据
            recommendations_json = []
            
            for rec_index, rec in enumerate(recommendations):
                print(f"  处理推荐 #{rec_index+1}，职业ID: {rec['career_id']}")
                # 处理匹配原因
                match_reasons = []
                if rec['match_reasons']:
                    try:
                        match_reasons = json.loads(rec['match_reasons'])
                        print(f"    解析到匹配原因: {len(match_reasons)} 条")
                    except Exception as e:
                        print(f"    解析匹配原因失败: {e}")
                        # 尝试不同的解析方式
                        if isinstance(rec['match_reasons'], str):
                            match_reasons = rec['match_reasons'].strip('[]').split(',')
                            match_reasons = [r.strip('" ') for r in match_reasons]
                            print(f"    使用替代方法解析到匹配原因: {len(match_reasons)} 条")
                else:
                    print("    没有匹配原因数据")
                
                # 处理技能分析
                skills_analysis = {"matched_skills": [], "missing_skills": []}
                if rec['skills_analysis']:
                    try:
                        skills_analysis = json.loads(rec['skills_analysis'])
                        print(f"    解析技能分析成功")
                    except Exception as e:
                        print(f"    解析技能分析失败: {e}")
                else:
                    print("    没有技能分析数据")
                
                # 处理职业潜力
                career_potential = {"advantage_points": [], "growth_potential": 0.5, "growth_prospects": "暂无数据"}
                if rec['career_potential']:
                    try:
                        career_potential = json.loads(rec['career_potential'])
                        print(f"    解析职业潜力成功")
                    except Exception as e:
                        print(f"    解析职业潜力失败: {e}")
                else:
                    print("    没有职业潜力数据")
                
                # 创建推荐项
                detailed_analysis = rec['detailed_analysis'] or f"暂无针对职业{rec['career_id']}的分析"
                recommendation_item = {
                    "career_id": rec['career_id'],
                    "title": rec['title'],
                    "match_score": rec['match_score'],
                    "rank": rec['recommendation_rank'] or (rec_index + 1),
                    "deepseek_analysis": {
                        "match_reasons": match_reasons,
                        "skills_analysis": skills_analysis,
                        "career_potential": career_potential,
                        "detailed_analysis": detailed_analysis
                    }
                }
                
                recommendations_json.append(recommendation_item)
                print(f"    添加推荐项到JSON数据: {rec['title']}")
            
            # 更新会话记录
            session_data = {
                "session_id": session_id,
                "recommendations": recommendations_json
            }
            
            # 检查会话是否存在
            cursor.execute(
                "SELECT COUNT(*) as count FROM recommendation_sessions WHERE session_id = %s",
                (session_id,)
            )
            result = cursor.fetchone()
            session_exists = result['count'] > 0
            
            if not session_exists:
                print(f"会话 {session_id} 不存在于recommendation_sessions表中，跳过更新")
                continue
            
            # 添加到批量更新列表
            all_session_data.append((json.dumps(session_data), session_id))
            print(f"会话 {session_id} 的数据已准备好，等待批量更新")
        
        # 批量更新会话记录
        print(f"\n开始批量更新 {len(all_session_data)} 个会话记录...")
        
        for json_data, session_id in all_session_data:
            retries = 0
            success = False
            
            while retries < MAX_RETRIES and not success:
                try:
                    # 更新数据库
                    print(f"更新会话 {session_id} 的推荐数据 (尝试 #{retries+1})...")
                    cursor.execute(
                        "UPDATE recommendation_sessions SET recommendations_data = %s WHERE session_id = %s",
                        (json_data, session_id)
                    )
                    print(f"已更新会话 {session_id} 的推荐数据")
                    success = True
                    session_count += 1
                except Exception as e:
                    retries += 1
                    print(f"更新会话 {session_id} 失败: {e}")
                    if retries < MAX_RETRIES:
                        print(f"将在1秒后重试 (剩余重试次数: {MAX_RETRIES - retries})...")
                        time.sleep(1)
                    else:
                        print(f"已达到最大重试次数，放弃更新会话 {session_id}")
        
        # 提交事务
        conn.commit()
        print(f"成功更新 {session_count} 个会话的推荐数据")
        
        # 4. 验证数据
        cursor.execute("SELECT COUNT(*) as count FROM recommendation_sessions WHERE recommendations_data IS NOT NULL")
        result = cursor.fetchone()
        updated_count = result['count']
        print(f"数据库中共有 {updated_count} 条会话记录包含推荐数据")
        
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
    merge_recommendations() 