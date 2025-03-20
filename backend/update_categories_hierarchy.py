import os
import pymysql
from datetime import datetime

# 数据库配置
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"
DB_PASSWORD = "123456"
DB_NAME = "cursor06"

# 当前时间
now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 定义职业分类层次结构
category_hierarchy = {
    # 1. 技术/互联网（主类ID=1）
    1: [
        # 二级分类
        {
            "name": "技术开发", 
            "description": "软件与技术开发相关职业",
            "subcategories": [
                {"name": "软件工程师", "description": "负责软件系统研发与维护的专业人员"},
                {"name": "前端开发", "description": "负责网站和应用程序用户界面开发的工程师"},
                {"name": "算法工程师", "description": "负责开发和优化算法的专业技术人员"}
            ]
        },
        {
            "name": "硬件与运维", 
            "description": "计算机硬件和系统运维相关职业",
            "subcategories": [
                {"name": "网络工程师", "description": "负责网络系统规划、部署与维护的专业人员"},
                {"name": "硬件测试员", "description": "负责计算机硬件产品质量测试的技术人员"},
                {"name": "服务器运维", "description": "负责服务器系统运行维护的专业人员"}
            ]
        },
        {
            "name": "新兴技术", 
            "description": "新兴数字技术领域相关职业",
            "subcategories": [
                {"name": "区块链开发工程师", "description": "从事区块链技术研发的工程师"},
                {"name": "AI训练师", "description": "负责人工智能模型训练与优化的专业人员"},
                {"name": "元宇宙架构师", "description": "负责虚拟现实世界构建的技术专家"}
            ]
        },
        {
            "name": "产品与运营", 
            "description": "互联网产品设计与运营相关职业",
            "subcategories": [
                {"name": "产品经理", "description": "负责产品规划、设计与管理的专业人员"},
                {"name": "用户运营", "description": "负责产品用户增长与活跃度提升的专业人员"},
                {"name": "数据分析师", "description": "通过数据分析提供决策支持的专业人员"}
            ]
        }
    ],
    
    # 2. 金融/财会（主类ID=6）
    6: [
        {
            "name": "投资交易", 
            "description": "投资和交易相关职业",
            "subcategories": [
                {"name": "证券分析师", "description": "负责证券市场研究与分析的专业人员"},
                {"name": "基金经纪人", "description": "负责基金销售与客户服务的专业人员"},
                {"name": "量化交易员", "description": "利用数学模型进行金融交易的专业人员"}
            ]
        },
        {
            "name": "财税审计", 
            "description": "财务、税务与审计相关职业",
            "subcategories": [
                {"name": "注册会计师", "description": "提供专业审计与会计服务的认证人员"},
                {"name": "税务筹划师", "description": "负责税务合规与优化的专业人员"},
                {"name": "合规审计员", "description": "负责企业合规性检查与审计的专业人员"}
            ]
        },
        {
            "name": "金融科技", 
            "description": "金融技术创新相关职业",
            "subcategories": [
                {"name": "区块链金融师", "description": "负责区块链金融产品开发与应用的专业人员"},
                {"name": "支付安全工程师", "description": "负责金融支付安全保障的技术人员"},
                {"name": "ESG投资顾问", "description": "专注环境、社会和治理投资领域的专业顾问"}
            ]
        }
    ],
    
    # 3. 医疗/健康（主类ID=10）
    10: [
        {
            "name": "临床医学", 
            "description": "临床医疗相关职业",
            "subcategories": [
                {"name": "外科医生", "description": "专门从事外科手术治疗的医生"},
                {"name": "全科医师", "description": "提供综合基础医疗服务的医生"},
                {"name": "中医师", "description": "运用传统中医理论进行诊疗的医生"}
            ]
        },
        {
            "name": "健康管理", 
            "description": "健康维护与管理相关职业",
            "subcategories": [
                {"name": "营养师", "description": "提供饮食营养指导的专业人员"},
                {"name": "康复治疗师", "description": "帮助患者恢复身体功能的专业医疗人员"},
                {"name": "基因检测顾问", "description": "提供基因检测分析与健康建议的专业人员"}
            ]
        },
        {
            "name": "医疗技术", 
            "description": "医疗技术相关职业",
            "subcategories": [
                {"name": "医学影像技师", "description": "负责医学影像设备操作与图像采集的专业人员"},
                {"name": "医疗器械研发", "description": "从事医疗设备研发与创新的专业人员"},
                {"name": "AI辅助诊断工程师", "description": "开发人工智能医疗诊断系统的技术人员"}
            ]
        }
    ],
    
    # 4. 管理类（主类ID=21）
    21: [
        {
            "name": "职能管理", 
            "description": "企业职能部门管理相关职业",
            "subcategories": [
                {"name": "HRBP", "description": "人力资源业务合作伙伴，负责人力资源战略实施"},
                {"name": "行政主管", "description": "负责企业行政事务管理与协调的管理人员"},
                {"name": "供应链经理", "description": "负责供应链规划与管理的专业人员"}
            ]
        },
        {
            "name": "战略管理", 
            "description": "企业战略发展相关职业",
            "subcategories": [
                {"name": "项目经理", "description": "负责项目全生命周期管理的专业人员"},
                {"name": "品牌总监", "description": "负责企业品牌策略与管理的高级管理人员"},
                {"name": "企业咨询顾问", "description": "为企业提供专业管理咨询的顾问"}
            ]
        }
    ],
    
    # 5. 创意类（主类ID=22）
    22: [
        {
            "name": "内容创作", 
            "description": "内容创意与创作相关职业",
            "subcategories": [
                {"name": "短视频编导", "description": "负责短视频内容策划与制作的创意人员"},
                {"name": "广告文案", "description": "负责创作广告文字内容的创意人员"},
                {"name": "新媒体策划", "description": "负责新媒体内容策划与运营的专业人员"}
            ]
        },
        {
            "name": "视觉设计", 
            "description": "视觉艺术与设计相关职业",
            "subcategories": [
                {"name": "UI/UX设计师", "description": "负责用户界面与体验设计的专业人员"},
                {"name": "3D建模师", "description": "创建三维数字模型的设计专家"},
                {"name": "数字艺术创作者", "description": "使用数字技术进行艺术创作的专业人员"}
            ]
        }
    ],
    
    # 6. 教育/培训（主类ID=14）
    14: [
        {
            "name": "学科教育", 
            "description": "学科知识教育相关职业",
            "subcategories": [
                {"name": "K12教师", "description": "基础教育阶段各学科教师"},
                {"name": "STEAM教育导师", "description": "科学、技术、工程、艺术和数学综合教育专家"},
                {"name": "职业教育讲师", "description": "职业技能与知识培训的专业教师"}
            ]
        },
        {
            "name": "技能培训", 
            "description": "专业技能培训相关职业",
            "subcategories": [
                {"name": "职业规划师", "description": "帮助个人规划职业发展路径的专业人员"},
                {"name": "企业内训师", "description": "为企业员工提供专业培训的讲师"},
                {"name": "语言教练", "description": "专注语言能力培养与提升的教育工作者"}
            ]
        }
    ],
    
    # 7. 行政职业（主类ID=29）
    29: [
        {
            "name": "政府事务", 
            "description": "政府行政工作相关职业",
            "subcategories": [
                {"name": "政策制定专员", "description": "参与政府政策研究与制定的专业人员"},
                {"name": "公共资源管理", "description": "负责公共资源规划与管理的行政人员"},
                {"name": "行政监督", "description": "从事行政监察与审计工作的专业人员"}
            ]
        },
        {
            "name": "企业行政", 
            "description": "企业行政事务相关职业",
            "subcategories": [
                {"name": "办公事务主管", "description": "负责企业日常办公事务管理的行政人员"},
                {"name": "人力资源支持", "description": "提供人力资源服务与支持的专业人员"},
                {"name": "远程行政支持岗", "description": "为远程工作团队提供行政支持的专业人员"}
            ]
        },
        {
            "name": "社区服务", 
            "description": "社区行政服务相关职业",
            "subcategories": [
                {"name": "社区工作者", "description": "从事社区服务与管理的基层工作人员"},
                {"name": "基层调解员", "description": "负责社区纠纷调解的专业人员"},
                {"name": "公共事务协调员", "description": "负责社区公共事务协调的工作人员"}
            ]
        }
    ],
    
    # 8. 新兴领域（主类ID=30）
    30: [
        {
            "name": "数字技术", 
            "description": "数字技术创新相关职业",
            "subcategories": [
                {"name": "人工智能工程师", "description": "从事人工智能技术研发的专业工程师"},
                {"name": "区块链应用开发", "description": "从事区块链技术研发与应用的工程师"},
                {"name": "元宇宙内容设计师", "description": "负责虚拟世界内容创作的设计师"}
            ]
        },
        {
            "name": "绿色经济", 
            "description": "环保与可持续发展相关职业",
            "subcategories": [
                {"name": "碳资产管理师", "description": "负责碳排放权交易与管理的专业人员"},
                {"name": "新能源技术员", "description": "从事新能源技术应用与维护的专业人员"},
                {"name": "循环经济顾问", "description": "提供资源循环利用咨询服务的专业顾问"}
            ]
        },
        {
            "name": "跨界服务", 
            "description": "跨领域创新服务相关职业",
            "subcategories": [
                {"name": "互联网医疗顾问", "description": "提供在线医疗咨询服务的专业人员"},
                {"name": "数字化农业技术员", "description": "负责农业数字化转型技术应用的专业人员"},
                {"name": "智能家居规划师", "description": "为客户设计智能家居解决方案的专业人员"}
            ]
        }
    ],
    
    # 9. 生活服务（主类ID=31）
    31: [
        {
            "name": "家庭服务", 
            "description": "家庭生活服务相关职业",
            "subcategories": [
                {"name": "家政服务", "description": "提供专业家庭事务管理的服务人员"},
                {"name": "家庭健康管理", "description": "负责家庭成员健康指导的专业人员"},
                {"name": "养老护理员", "description": "为老年人提供专业照料服务的护理人员"}
            ]
        },
        {
            "name": "个人消费", 
            "description": "个人消费服务相关职业",
            "subcategories": [
                {"name": "美容美发师", "description": "提供美容美发服务的专业人员"},
                {"name": "健身教练", "description": "提供健身指导与训练的专业教练"},
                {"name": "宠物医疗顾问", "description": "提供宠物健康咨询与医疗服务的专业人员"}
            ]
        },
        {
            "name": "本地化服务", 
            "description": "社区本地服务相关职业",
            "subcategories": [
                {"name": "旅游向导", "description": "提供旅游行程指导与讲解的专业人员"},
                {"name": "民宿运营", "description": "负责特色民宿经营与管理的专业人员"},
                {"name": "社区团购团长", "description": "组织社区团体购物活动的服务人员"}
            ]
        }
    ],
}

try:
    # 连接到MySQL数据库
    connection = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    print("数据库连接成功!")
    
    with connection.cursor() as cursor:
        # 1. 临时禁用外键约束
        print("临时禁用外键约束...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        # 2. 删除现有的二级和三级分类，但保留9个顶级分类
        print("删除现有的子分类...")
        cursor.execute("DELETE FROM career_categories WHERE parent_id IS NOT NULL")
        
        # 3. 重新启用外键约束
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        connection.commit()
        print("已删除所有子分类")
        
        # 4. 获取当前最大ID
        cursor.execute("SELECT MAX(id) FROM career_categories")
        max_id = cursor.fetchone()[0]
        current_id = max_id + 1 if max_id else 100
        
        # 5. 添加新的分类层次结构
        print("\n开始添加新的分类层次结构...")
        total_level2 = 0
        total_level3 = 0
        
        # 先获取所有现有分类名称，用于检查重复
        cursor.execute("SELECT name FROM career_categories")
        existing_names = set(row[0] for row in cursor.fetchall())
        
        # 遍历每个顶级分类
        for top_category_id, level2_categories in category_hierarchy.items():
            # 查询顶级分类名称
            cursor.execute(f"SELECT name FROM career_categories WHERE id = {top_category_id}")
            top_name = cursor.fetchone()[0]
            print(f"\n处理顶级分类: {top_name} (ID: {top_category_id})")
            
            # 添加二级分类
            for level2_category in level2_categories:
                # 插入二级分类
                original_level2_name = level2_category["name"]
                level2_name = original_level2_name
                
                # 如果名称已存在，添加前缀使其唯一
                counter = 1
                while level2_name in existing_names:
                    level2_name = f"{original_level2_name}_{counter}"
                    counter += 1
                
                level2_desc = level2_category["description"]
                
                # 添加到数据库
                level2_id = current_id
                cursor.execute(f"""
                    INSERT INTO career_categories 
                    (id, name, description, parent_id, level, created_at, updated_at)
                    VALUES 
                    ({level2_id}, '{level2_name}', '{level2_desc}', {top_category_id}, 2, '{now}', '{now}')
                """)
                current_id += 1
                total_level2 += 1
                
                # 添加到已存在名称集合
                existing_names.add(level2_name)
                
                print(f"  添加二级分类: {level2_name} (ID: {level2_id})")
                
                # 添加三级分类
                for level3_category in level2_category.get("subcategories", []):
                    original_level3_name = level3_category["name"]
                    level3_name = original_level3_name
                    
                    # 如果名称已存在，添加前缀使其唯一
                    counter = 1
                    while level3_name in existing_names:
                        level3_name = f"{original_level3_name}_{counter}"
                        counter += 1
                    
                    level3_desc = level3_category["description"]
                    
                    # 添加到数据库
                    cursor.execute(f"""
                        INSERT INTO career_categories 
                        (id, name, description, parent_id, level, created_at, updated_at)
                        VALUES 
                        ({current_id}, '{level3_name}', '{level3_desc}', {level2_id}, 3, '{now}', '{now}')
                    """)
                    print(f"    添加三级分类: {level3_name} (ID: {current_id})")
                    
                    # 添加到已存在名称集合
                    existing_names.add(level3_name)
                    
                    current_id += 1
                    total_level3 += 1
            
            connection.commit()
        
        # 6. 统计信息
        cursor.execute("SELECT COUNT(*) FROM career_categories")
        total_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE parent_id IS NULL")
        level1_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE level = 2")
        level2_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM career_categories WHERE level = 3")
        level3_count = cursor.fetchone()[0]
        
        print("\n=== 分类更新完成 ===")
        print(f"总分类数: {total_count}")
        print(f"顶级分类数: {level1_count}")
        print(f"二级分类数: {level2_count} (新增: {total_level2})")
        print(f"三级分类数: {level3_count} (新增: {total_level3})")
        
except Exception as e:
    print(f"更新分类数据时出错: {e}")
finally:
    if 'connection' in locals():
        connection.close()
        print("数据库连接已关闭") 