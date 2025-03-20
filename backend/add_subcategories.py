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

# 子分类数据
subcategories = [
    # 金融/财会 (6) 子分类
    {"name": "金融科技师", "description": "利用现代技术解决金融业务问题的职业", "parent_id": 6},
    {"name": "ESG投资顾问", "description": "专注环境、社会和治理投资领域的顾问", "parent_id": 6},
    
    # 医疗/健康 (10) 子分类
    {"name": "康复治疗师", "description": "专注于患者身体功能恢复的医疗专业人员", "parent_id": 10},
    {"name": "基因检测员", "description": "进行基因测序和分析的专业技术人员", "parent_id": 10},
    
    # 教育/培训 (14) 子分类
    {"name": "STEAM教育导师", "description": "科学、技术、工程、艺术和数学综合教育专家", "parent_id": 14},
    {"name": "职业规划师", "description": "帮助个人规划职业发展路径的专业人员", "parent_id": 14},
    
    # 管理类 (21) 子分类
    {"name": "项目管理", "description": "负责规划、执行和监督项目全生命周期的管理者", "parent_id": 21},
    {"name": "供应链管理", "description": "负责优化供应链流程和资源配置的管理者", "parent_id": 21},
    
    # 创意类 (22) 子分类
    {"name": "数字艺术设计师", "description": "利用数字技术创作艺术作品的创意人员", "parent_id": 22},
    {"name": "短视频编导", "description": "策划和制作短视频内容的创意专业人员", "parent_id": 22},
    
    # 行政职业 (29) 子分类
    {"name": "远程行政支持岗", "description": "为远程工作团队提供行政支持的专业人员", "parent_id": 29},
    
    # 新兴领域 (30) 子分类
    {"name": "区块链开发者", "description": "开发和维护区块链技术应用的专业人员", "parent_id": 30},
    {"name": "碳排放管理师", "description": "负责企业碳排放监测和减排方案设计的专业人员", "parent_id": 30},
    
    # 生活服务 (31) 子分类
    {"name": "宠物医疗", "description": "提供宠物医疗和健康服务的专业人员", "parent_id": 31},
    {"name": "家政管理", "description": "提供家庭事务管理和服务的专业人员", "parent_id": 31},
]

try:
    with engine.connect() as conn:
        # 先获取现有最大ID
        max_id = conn.execute(text("SELECT MAX(id) FROM career_categories")).fetchone()[0]
        current_id = max_id + 1 if max_id else 100
        
        # 添加子分类
        for subcategory in subcategories:
            # 检查是否已存在相同名称的子分类
            exists = conn.execute(text(f"SELECT id FROM career_categories WHERE name = '{subcategory['name']}' AND parent_id = {subcategory['parent_id']}")).fetchone()
            
            if not exists:
                conn.execute(text(f"""
                    INSERT INTO career_categories 
                    (id, name, description, parent_id, level, created_at, updated_at)
                    VALUES 
                    ({current_id}, '{subcategory['name']}', '{subcategory['description']}', {subcategory['parent_id']}, 2, '{now}', '{now}')
                """))
                print(f"添加子分类: {subcategory['name']} (ID: {current_id})")
                current_id += 1
            else:
                print(f"子分类已存在: {subcategory['name']}")
        
        conn.commit()
        
        # 查询结果
        print("\n=== 每个顶级分类的子分类数量 ===")
        parent_counts = conn.execute(text("""
            SELECT p.id, p.name, COUNT(c.id) as child_count
            FROM career_categories p
            LEFT JOIN career_categories c ON p.id = c.parent_id
            WHERE p.parent_id IS NULL
            GROUP BY p.id, p.name
            ORDER BY p.id
        """)).fetchall()
        
        for parent in parent_counts:
            print(f"ID: {parent[0]}, 名称: {parent[1]}, 子分类数量: {parent[2]}")
        
except Exception as e:
    print(f"添加子分类时出错: {e}")
    sys.exit(1) 