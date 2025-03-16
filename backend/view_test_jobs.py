import pandas as pd

def view_test_jobs():
    """查看测试职业信息文件的内容"""
    try:
        # 读取测试职业信息文件
        file_path = "uploads/test_jobs.xlsx"
        df = pd.read_excel(file_path)
        
        # 显示基本信息
        print(f"文件: {file_path}")
        print(f"行数: {len(df)}")
        print(f"列数: {len(df.columns)}")
        print(f"列名: {df.columns.tolist()}")
        
        # 显示每行数据
        print("\n职位信息:")
        for i, row in df.iterrows():
            print(f"\n--- 职位 {i+1} ---")
            for col in df.columns:
                print(f"{col}: {row[col]}")
    
    except Exception as e:
        print(f"查看文件时出错: {e}")

if __name__ == "__main__":
    view_test_jobs() 