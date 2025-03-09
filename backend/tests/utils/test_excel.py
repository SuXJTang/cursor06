import os
import pytest
import pandas as pd
from app.utils.excel import create_template, validate_excel
from app.schemas.job import JobCreate

def test_create_template():
    """测试创建Excel模板"""
    template_path = create_template()
    assert os.path.exists(template_path)
    
    # 验证文件内容
    df = pd.read_excel(template_path, sheet_name="职位信息")
    assert list(df.columns) == ["字段名", "是否必填", "描述", "示例值"]
    assert len(df) > 0
    
    # 验证数据sheet
    df = pd.read_excel(template_path, sheet_name="导入数据")
    required_columns = ["title", "company", "description", "requirements", 
                       "salary_range", "location", "job_type", "category_id",
                       "experience_required", "education_required"]
    for col in required_columns:
        assert col in df.columns
    
    # 清理测试文件
    os.remove(template_path)

def test_validate_excel_missing_required_column():
    """测试验证缺少必填列的Excel"""
    # 创建测试数据
    df = pd.DataFrame({
        "title": ["测试职位"],
        "company": ["测试公司"]
    })
    test_file = "test_missing_column.xlsx"
    df.to_excel(test_file, sheet_name="导入数据", index=False)
    
    # 验证数据
    valid_data, errors = validate_excel(test_file)
    assert len(valid_data) == 0
    assert len(errors) > 0
    assert any("缺少必填列" in error.message for error in errors)
    
    # 清理测试文件
    os.remove(test_file)

def test_validate_excel_empty_required_field():
    """测试验证必填字段为空的Excel"""
    # 创建测试数据
    data = {
        "title": [""],
        "company": ["测试公司"],
        "description": ["职位描述"],
        "requirements": ["职位要求"],
        "salary_range": ["15k-20k"],
        "location": ["深圳"],
        "job_type": ["全职"],
        "category_id": ["1"],
        "experience_required": ["3-5年"],
        "education_required": ["本科"]
    }
    df = pd.DataFrame(data)
    test_file = "test_empty_field.xlsx"
    df.to_excel(test_file, sheet_name="导入数据", index=False)
    
    # 验证数据
    valid_data, errors = validate_excel(test_file)
    assert len(valid_data) == 0
    assert len(errors) > 0
    assert any("必填字段不能为空" in error.message for error in errors)
    
    # 清理测试文件
    os.remove(test_file)

def test_validate_excel_valid_data():
    """测试验证有效的Excel数据"""
    # 创建测试数据
    data = {
        "title": ["Python开发工程师"],
        "company": ["测试科技有限公司"],
        "description": ["负责公司核心业务系统的开发"],
        "requirements": ["1. 熟练掌握Python编程"],
        "skills": ["Python,FastAPI,MySQL"],
        "benefits": ["五险一金,年终奖,带薪休假"],
        "salary_range": ["15k-25k"],
        "location": ["深圳"],
        "job_type": ["全职"],
        "category_id": ["1"],
        "experience_required": ["3-5年"],
        "education_required": ["本科"]
    }
    df = pd.DataFrame(data)
    test_file = "test_valid_data.xlsx"
    df.to_excel(test_file, sheet_name="导入数据", index=False)
    
    # 验证数据
    valid_data, errors = validate_excel(test_file)
    assert len(valid_data) == 1
    assert len(errors) == 0
    assert isinstance(valid_data[0], JobCreate)
    assert valid_data[0].title == "Python开发工程师"
    assert isinstance(valid_data[0].skills, list)
    assert len(valid_data[0].skills) == 3
    
    # 清理测试文件
    os.remove(test_file)

def test_validate_excel_invalid_format():
    """测试验证格式无效的Excel数据"""
    # 创建测试数据
    data = {
        "title": ["Python开发工程师"],
        "company": ["测试科技有限公司"],
        "description": ["负责公司核心业务系统的开发"],
        "requirements": ["1. 熟练掌握Python编程"],
        "skills": ["这是一个无效的技能格式"],  # 应该用逗号分隔
        "benefits": ["这也是一个无效的福利格式"],  # 应该用逗号分隔
        "salary_range": ["invalid"],  # 无效的薪资范围
        "location": ["深圳"],
        "job_type": ["全职"],
        "category_id": ["invalid"],  # 应该是数字
        "experience_required": ["3-5年"],
        "education_required": ["本科"]
    }
    df = pd.DataFrame(data)
    test_file = "test_invalid_format.xlsx"
    df.to_excel(test_file, sheet_name="导入数据", index=False)
    
    # 验证数据
    valid_data, errors = validate_excel(test_file)
    assert len(valid_data) == 0
    assert len(errors) > 0
    assert any("数据验证错误" in error.message for error in errors)
    
    # 清理测试文件
    os.remove(test_file) 