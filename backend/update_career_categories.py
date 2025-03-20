import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from datetime import datetime

# 加载环境变量
load_dotenv(".env")

# 数据库配置
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "123456")
DB_NAME = os.getenv("DB_NAME", "cursor06")

# 创建数据库连接
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# 当前时间
now = datetime.now()

# 要保留的顶级分类
keep_categories = [
    {"id": 1, "name": "技术/互联网", "description": "各类技术研发和互联网相关职业"},
    {"id": 6, "name": "金融/财会", "description": "金融行业和财会相关职业"},
    {"id": 10, "name": "医疗/健康", "description": "医疗卫生和健康管理相关职业"},
    {"id": 14, "name": "教育/培训", "description": "教育体系和培训服务相关职业"},
    {"id": 21, "name": "管理类", "description": "各类管理岗位相关职业"},
    {"id": 22, "name": "创意类", "description": "创意设计和内容创作相关职业"},
    {"id": 29, "name": "行政职业", "description": "行政事务和办公支持相关职业"},
    # 新增两个顶级分类
    {"id": 30, "name": "新兴领域", "description": "数字技术和新兴产业相关职业"},
    {"id": 31, "name": "生活服务", "description": "生活服务和便民服务相关职业"}
]

# 保留的分类ID列表
keep_ids = [cat["id"] for cat in keep_categories]

try:
    with engine.connect() as conn:
        # 1. 检查数据库中当前的分类
        current_categories = conn.execute(text("SELECT id, name FROM career_categories WHERE parent_id IS NULL")).fetchall()
        print("=== 当前顶级分类 ===")
        for cat in current_categories:
            print(f"ID: {cat[0]}, 名称: {cat[1]}")
        
        # 2. 先将careers表中引用不在保留列表中的分类ID改为默认值1（技术/互联网）
        conn.execute(text(f"""
            UPDATE careers 
            SET category_id = 1 
            WHERE category_id NOT IN ({','.join(map(str, keep_ids))})
        """))
        conn.commit()
        print("已将careers表中的职业分类引用更新为默认值")
        
        # 3. 删除不在保留列表中的顶级分类
        for cat in current_categories:
            if cat[0] not in keep_ids:
                # 先将该分类的子分类的parent_id设为NULL
                conn.execute(text(f"UPDATE career_categories SET parent_id = NULL WHERE parent_id = {cat[0]}"))
                # 然后删除该分类
                conn.execute(text(f"DELETE FROM career_categories WHERE id = {cat[0]}"))
                print(f"已删除分类: ID={cat[0]}, 名称={cat[1]}")
        
        conn.commit()
        
        # 4. 更新或插入保留的顶级分类
        for category in keep_categories:
            # 检查是否存在
            result = conn.execute(text(f"SELECT id FROM career_categories WHERE id = {category['id']}")).fetchone()
            
            if result:
                # 更新已存在的分类
                conn.execute(text(f"""
                    UPDATE career_categories 
                    SET name = '{category['name']}',
                        description = '{category['description']}',
                        parent_id = NULL,
                        level = 1,
                        updated_at = '{now}'
                    WHERE id = {category['id']}
                """))
                print(f"已更新分类: ID={category['id']}, 名称={category['name']}")
            else:
                # 插入新的分类
                conn.execute(text(f"""
                    INSERT INTO career_categories 
                    (id, name, description, parent_id, level, created_at, updated_at)
                    VALUES 
                    ({category['id']}, '{category['name']}', '{category['description']}', NULL, 1, '{now}', '{now}')
                """))
                print(f"已新增分类: ID={category['id']}, 名称={category['name']}")
        
        conn.commit()
        
        # 5. 查询结果确认
        categories = conn.execute(text("SELECT id, name FROM career_categories WHERE parent_id IS NULL ORDER BY id")).fetchall()
        
        print("\n=== 更新后的职业顶级分类 ===")
        for cat in categories:
            print(f"ID: {cat[0]}, 名称: {cat[1]}")
        
        print(f"\n成功设置 {len(categories)} 个顶级分类")
        
except Exception as e:
    print(f"更新分类时出错: {e}")
    sys.exit(1) 