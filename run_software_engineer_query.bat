@echo off
echo ================================
echo 软件工程师职业数据级联查询工具
echo ================================
echo.
echo 请选择查询方式:
echo 1. API方式 (通过后端API查询数据)
echo 2. SQL方式 (直接从数据库查询数据)
echo 3. 退出
echo.

set /p choice=请输入选项（1/2/3）: 

if "%choice%"=="1" (
    echo.
    echo 正在通过API查询软件工程师职业数据...
    python query_software_engineer_careers.py
    goto end
)

if "%choice%"=="2" (
    echo.
    echo 正在通过SQL查询软件工程师职业数据...
    python query_software_engineer_careers_sql.py
    goto end
)

if "%choice%"=="3" (
    echo 已退出程序
    goto end
)

echo.
echo 无效的选项，请重新运行程序

:end
echo.
pause 