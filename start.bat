@echo off
echo Starting HR Approval App for Initiative (HAI)...
echo.

REM Start backend in a new window
start "HR Initiative Backend" cmd /k "cd backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "HR Initiative Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop both servers...
pause >nul

REM This will close both windows when user presses a key
taskkill /FI "WINDOWTITLE eq HR Initiative Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq HR Initiative Frontend*" /F >nul 2>&1
