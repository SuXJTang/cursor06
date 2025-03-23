@echo off
chcp 65001
echo 正在启动后端服务器...
cd backend
call venv\Scripts\activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 