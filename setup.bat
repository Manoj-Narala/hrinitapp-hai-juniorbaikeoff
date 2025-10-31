@echo off
echo ========================================
echo HR Approval App for Initiative (HAI) - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Node.js found: 
node --version
echo.

echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [3/5] Installing frontend dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [4/5] Setting up environment configuration...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit backend\.env and add your GEMINI_API_KEY
) else (
    echo .env file already exists
)
echo.

echo [5/5] Creating database directory...
cd ..\data
if not exist initiatives.json (
    echo {"initiatives": []} > initiatives.json
    echo Database file created!
) else (
    echo Database file already exists
)
cd ..
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Edit backend\.env and add your Gemini API key
echo.
echo To start the application:
echo   1. Open terminal #1: cd backend ^& npm run dev
echo   2. Open terminal #2: cd frontend ^& npm run dev
echo   3. Open browser: http://localhost:5173
echo.
pause
