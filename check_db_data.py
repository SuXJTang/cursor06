import mysql.connector
import json
import sys

# 直接设置数据库连接信息
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06" 
DB_PORT = 3306

try:
    # 连接到数据库
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )
    
    print(f"成功连接到数据库: {DB_NAME}")
    
    cursor = conn.cursor(dictionary=True)
    
    # 检查career_recommendations表中的记录数
    cursor.execute("SELECT COUNT(*) as count FROM career_recommendations")
    result = cursor.fetchone()
    total_records = result['count']
    print(f"career_recommendations表中共有 {total_records} 条记录")
    
    # 检查recommendation_sessions表中的记录数
    cursor.execute("SELECT COUNT(*) as count FROM recommendation_sessions")
    result = cursor.fetchone()
    total_sessions = result['count']
    print(f"recommendation_sessions表中共有 {total_sessions} 条记录")
    
    # 检查匹配原因为空的记录数
    cursor.execute("SELECT COUNT(*) as count FROM career_recommendations WHERE match_reasons IS NULL OR match_reasons = ''")
    result = cursor.fetchone()
    empty_reasons = result['count']
    print(f"match_reasons为空的记录数: {empty_reasons}")
    
    # 简单查询所有记录
    cursor.execute("SELECT * FROM career_recommendations")
    records = cursor.fetchall()
    
    if records:
        print("\n" + "=" * 80)
        print(f"共找到 {len(records)} 条推荐记录:")
        
        for record in records:
            print("-" * 80)
            print(f"记录ID: {record['id']}")
            print(f"用户ID: {record['user_id']}")
            print(f"职业ID: {record['career_id']}")
            print(f"匹配分数: {record['match_score']}")
            
            # 解析并显示匹配原因
            try:
                if record['match_reasons']:
                    reasons = json.loads(record['match_reasons'])
                    print("匹配原因:")
                    for reason in reasons:
                        # 限制原因长度以避免输出过长
                        if len(reason) > 100:
                            reason = reason[:97] + "..."
                        print(f"  - {reason}")
                else:
                    print("匹配原因: 无")
            except Exception as e:
                print(f"解析匹配原因出错: {e}")
                print(f"原始match_reasons值: {record['match_reasons']}")
            
            # 显示会话ID和排名
            print(f"会话ID: {record.get('recommendation_session_id')}")
            if 'rank' in record:
                print(f"排名: {record['rank']}")
            elif 'recommendation_rank' in record:
                print(f"排名: {record['recommendation_rank']}")
    
    cursor.close()
    conn.close()
    print("\n数据库连接已关闭")

except Exception as e:
    print(f"错误: {e}")
    sys.exit(1) 