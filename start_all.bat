@echo off
echo Starting frontend and backend services...

echo Installing frontend dependencies...
cd /d D:\graduationDesign\cursor06\frontend-client
call npm install
echo Frontend dependencies installed.

rem Start frontend service
start cmd /k "cd /d D:\graduationDesign\cursor06\frontend-client && npm run dev"

rem Start backend service
start cmd /k "cd /d D:\graduationDesign\cursor06\backend && call .\venv_new\Scripts\activate.bat && .\venv_new\Scripts\python -m uvicorn app.main:app --reload"

echo Services startup commands executed, please check the command windows for more information. 