@echo off
echo Installing Film Proje Dependencies...

echo.
echo ===============================
echo [1/2] Backend Installation
echo ===============================
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing/Updating Python requirements...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ===============================
echo [2/2] Frontend Installation
echo ===============================
cd frontend
echo Installing Node modules...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ===============================
echo Installation Complete Successfuly!
echo ===============================
pause
