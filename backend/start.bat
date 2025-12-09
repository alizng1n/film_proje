@echo off
cd /d "%~dp0"
echo Starting Backend Server...
if exist venv\Scripts\activate (
    call venv\Scripts\activate
) else (
    echo Virtual environment not found. Please run installation first.
    pause
    exit /b
)

python -m uvicorn main:app --reload
pause
