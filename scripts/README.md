# 职业数据导入脚本使用说明

本目录包含多个用于导入职业数据的脚本，以实现方案一：保持当前数据库结构，添加关联到三级分类的职业数据。

## 脚本说明

1. **import_careers.py**：API方式导入技术/互联网分类下的职业数据
2. **import_careers_additional.py**：API方式导入其他分类下的职业数据
3. **bulk_import_from_csv.py**：从CSV文件批量导入职业数据
4. **import_careers_sql.py**：使用SQL直接导入职业数据（当API不可用时使用）
5. **career_data_template.csv**：CSV批量导入的模板文件

## 使用方法

### 1. API方式导入预设职业数据

执行以下命令导入技术/互联网分类下的职业数据：

```bash
python import_careers.py
```

执行以下命令导入其他分类下的职业数据：

```bash
python import_careers_additional.py
```

### 2. 从CSV文件批量导入

1. 参考 `career_data_template.csv` 创建你自己的CSV数据文件
2. 执行以下命令进行导入：

```bash
python bulk_import_from_csv.py your_data_file.csv
```

可以指定请求延迟时间：

```bash
python bulk_import_from_csv.py your_data_file.csv --delay 0.3
```

### 3. 使用SQL直接导入

如果API不可用，可以使用SQL直接导入：

```bash
python import_careers_sql.py
```

**注意**：使用前请确认 `import_careers_sql.py` 文件中的数据库配置是否正确，包括：
- host
- user
- password 
- database
- port

## CSV文件格式

CSV文件应包含以下列：

| 字段名 | 描述 | 示例值 |
|---|---|---|
| title | 职业名称 | 前端开发工程师 |
| description | 职业描述 | 负责Web前端界面开发和用户体验优化 |
| category_id | 分类ID | 34 |
| required_skills | 所需技能（JSON数组格式） | ["HTML", "CSS", "JavaScript"] |
| education_required | 学历要求 | 本科及以上 |
| experience_required | 经验要求 | 2年以上 |
| career_path | 职业发展路径（JSON数组格式） | ["初级前端", "高级前端", "架构师"] |
| salary_range | 薪资范围（JSON对象格式） | {"min": 10000, "max": 22000} |
| future_prospect | 发展前景 | 市场需求大 |

## 注意事项

1. 确保后端服务器正在运行
2. 在 `import_careers.py` 和 `import_careers_additional.py` 文件中更新正确的API地址和认证令牌
3. 导入完成后，通过API查询验证数据是否成功导入
4. 批量导入时建议先小批量测试，确认无误后再大批量导入
5. 如果遇到数据重复问题，可考虑在插入前先检查记录是否已存在 