import subprocess
import time
import os
import sys
import signal
import atexit

def start_server():
    """启动服务器"""
    print("正在启动服务器...")
    server_process = subprocess.Popen(
        ["uvicorn", "app.main:app", "--reload"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # 注册退出时的清理函数
    def cleanup():
        print("正在关闭服务器...")
        if server_process.poll() is None:  # 如果进程还在运行
            server_process.terminate()
            server_process.wait()
    
    atexit.register(cleanup)
    
    # 等待服务器启动
    print("等待服务器启动...")
    time.sleep(5)
    
    return server_process

def get_token():
    """获取访问令牌"""
    print("正在获取访问令牌...")
    result = subprocess.run(
        ["python", "get_token.py"],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("成功获取访问令牌")
    else:
        print(f"获取访问令牌失败: {result.stderr}")

def check_server_and_db():
    """检查服务器和数据库状态"""
    print("正在检查服务器和数据库状态...")
    result = subprocess.run(
        ["python", "check_server_and_db.py"],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("服务器和数据库状态检查完成")
    else:
        print(f"服务器和数据库状态检查失败: {result.stderr}")

def main():
    """主函数"""
    print("=" * 50)
    print("启动脚本开始执行")
    print("=" * 50)
    
    # 启动服务器
    server_process = start_server()
    
    try:
        # 获取访问令牌
        get_token()
        
        # 检查服务器和数据库状态
        check_server_and_db()
        
        print("\n服务器已启动并通过检查，按 Ctrl+C 停止服务器")
        
        # 保持脚本运行，直到用户按下 Ctrl+C
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n收到停止信号，正在关闭服务器...")
    finally:
        # 确保服务器进程被终止
        if server_process.poll() is None:  # 如果进程还在运行
            server_process.terminate()
            server_process.wait()
        
        print("服务器已关闭")

if __name__ == "__main__":
    main() 