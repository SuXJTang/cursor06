import pandas as pd
import os

# 创建测试数据
data = {
    'title': ['Python高级开发工程师', '前端开发工程师', '数据分析师'],
    'company': ['科技有限公司', '互联网科技', '数据科技有限公司'],
    'description': ['负责后端系统开发', '负责前端界面开发', '负责数据分析和报表'],
    'requirements': ['精通Python', '精通JavaScript', '精通SQL和数据分析'],
    'skills': ['Python,Django,FastAPI', 'JavaScript,Vue,React', 'SQL,Python,Excel'],
    'education_required': ['本科', '本科', '硕士'],
    'experience_required': ['3-5年', '2-3年', '1-3年'],
    'salary_range': ['20k-30k', '15k-25k', '18k-28k'],
    'location': ['北京', '上海', '广州'],
    'job_type': ['全职', '全职', '全职'],
    'status': ['active', 'active', 'active'],
    'benefits': ['五险一金,年终奖', '五险一金,弹性工作', '五险一金,专业培训'],
    'category_id': [1, 2, 3]
}

# 创建DataFrame
df = pd.DataFrame(data)

# 创建Excel文件
os.makedirs('uploads', exist_ok=True)
with pd.ExcelWriter('test_jobs.xlsx', engine='openpyxl') as writer:
    # 创建说明sheet
    df_info = pd.DataFrame({
        '字段名': ['title', 'company', 'description', 'requirements', 'skills', 'education_required', 
                'experience_required', 'salary_range', 'location', 'job_type', 'status', 'benefits', 'category_id'],
        '是否必填': ['是', '是', '是', '是', '否', '是', '是', '是', '是', '是', '是', '否', '是'],
        '描述': ['职位标题', '公司名称', '职位描述', '职位要求', '所需技能', '学历要求', 
               '所需工作经验', '薪资范围', '工作地点', '工作类型', '状态', '职位福利', '职位分类ID'],
        '示例值': ['Python开发工程师', 'XX科技有限公司', '负责公司核心业务系统的开发...', 
                '1. 熟练掌握Python编程...', 'Python,Django,FastAPI', '本科', 
                '3-5年', '15k-25k', '北京', '全职', 'active', '五险一金,年终奖,带薪休假', '1']
    })
    df_info.to_excel(writer, sheet_name='职位信息', index=False)
    
    # 创建数据sheet
    df.to_excel(writer, sheet_name='导入数据', index=False)

print('测试文件已创建: test_jobs.xlsx') 