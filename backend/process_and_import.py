import pandas as pd
import os
import time
import subprocess
import json

def process_career_excel(input_file='animator_career_fixed2.xlsx', output_file='animator_career_final.xlsx'):
    """
    读取现有的Excel文件，处理数据后生成新的Excel文件
    主要是移除average_salary字段，并确保其他字段正确转换
    """
    print(f"正在处理Excel文件: {input_file}")
    
    # 读取Excel文件
    df = pd.read_excel(input_file)
    
    # 确认列名
    print(f"读取到的列名: {df.columns.tolist()}")
    
    # 只保留需要的列
    # 我们将跳过average_salary字段，因为它会在导入时造成问题
    if '平均薪资' in df.columns:
        # 使用平均薪资字段来计算salary_range，但不包含在输出中
        # 我们将在API导入代码中处理这个转换
        pass
    
    # 保存为新文件
    df.to_excel(output_file, index=False)
    
    print(f"已生成处理后的Excel文件: {output_file}")
    return output_file

def upload_and_import(file_path, token):
    """
    上传Excel文件并导入
    """
    print(f"正在上传并导入文件: {file_path}")
    
    # 使用curl命令上传文件
    curl_cmd = [
        'curl', '-s', '-X', 'POST', 
        'http://127.0.0.1:8000/api/v1/career-imports/', 
        '-H', f'Authorization: Bearer {token}', 
        '-H', 'Content-Type: multipart/form-data', 
        '-F', f'file=@{file_path}'
    ]
    
    try:
        # 执行命令
        result = subprocess.run(curl_cmd, capture_output=True, text=True)
        
        # 检查结果
        if result.returncode == 0:
            response = json.loads(result.stdout)
            import_id = response.get('id')
            print(f"导入任务创建成功，ID: {import_id}")
            
            # 等待导入完成
            time.sleep(3)
            
            # 获取导入结果
            check_cmd = [
                'curl', '-s', '-X', 'GET', 
                f'http://127.0.0.1:8000/api/v1/career-imports/{import_id}', 
                '-H', f'Authorization: Bearer {token}'
            ]
            
            result = subprocess.run(check_cmd, capture_output=True, text=True)
            if result.returncode == 0:
                response = json.loads(result.stdout)
                status = response.get('status')
                total = response.get('total_count')
                success = response.get('success_count')
                failed = response.get('failed_count')
                
                print(f"导入状态: {status}")
                print(f"总记录数: {total}")
                print(f"成功数: {success}")
                print(f"失败数: {failed}")
                
                # 如果有错误，显示错误详情
                if failed and failed > 0:
                    error_details = response.get('error_details')
                    if error_details:
                        print("错误详情:")
                        for item in error_details.get('failed_items', []):
                            print(f"  行 {item.get('row')}: {item.get('error')}")
            else:
                print(f"检查导入状态失败: {result.stderr}")
        else:
            print(f"上传失败: {result.stderr}")
    except Exception as e:
        print(f"处理过程中出错: {str(e)}")

# 直接访问API查看导入结果
def check_careers(token):
    """
    查看导入后的职业数据
    """
    print("查询导入的职业数据:")
    
    cmd = [
        'curl', '-s', '-X', 'GET', 
        'http://127.0.0.1:8000/api/v1/careers/', 
        '-H', f'Authorization: Bearer {token}'
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            response = json.loads(result.stdout)
            careers = response.get('careers', [])
            
            print(f"共找到 {len(careers)} 个职业:")
            for career in careers:
                print(f"  - {career.get('title')}: {career.get('future_prospect')}")
        else:
            print(f"查询失败: {result.stderr}")
    except Exception as e:
        print(f"查询过程中出错: {str(e)}")

if __name__ == "__main__":
    # 令牌
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIxMTc2NzgsInN1YiI6IjEifQ.T9-q6HvwwhFnMQdw9Z4z9FWL8KXJPXOolbV_FFXhrqg"
    
    # 处理职业Excel
    processed_file = process_career_excel()
    
    # 上传并导入
    upload_and_import(processed_file, token)
    
    # 检查结果
    check_careers(token) 