import os
import sys
import subprocess

def start_backend():
    """启动后端服务的正确方式"""
    print("正在启动后端服务...")
    
    # 获取当前目录
    current_dir = os.getcwd()
    backend_dir = os.path.join(current_dir, "backend")
    
    if not os.path.exists(backend_dir):
        print(f"错误: 后端目录不存在: {backend_dir}")
        return
    
    # 切换到backend目录
    os.chdir(backend_dir)
    print(f"已切换到目录: {os.getcwd()}")
    
    # 检查main.py是否存在
    if not os.path.exists("main.py"):
        print("错误: main.py不存在")
        return
    
    # 添加当前目录到Python路径
    sys.path.insert(0, os.getcwd())
    
    print("开始执行main.py...")
    try:
        # 直接使用subprocess执行python命令
        subprocess.run(["python", "main.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"执行失败: {e}")
    except KeyboardInterrupt:
        print("用户中断执行")
    
    print("后端服务已停止")

if __name__ == "__main__":
    start_backend() 