@echo off
title VIRTUAL TUNE - Dev Launcher
echo =========================================================================
echo       KHOI DONG HE THONG VIRTUAL TUNE (BACKEND + FRONTEND)
echo =========================================================================
echo.

echo [1/2] Dang khoi dong Backend Spring Boot (Java 25 - Port 8080)...
start "Virtual Tune - Backend (Spring Boot)" cmd /k "cd /d %~dp0backend && mvnw.cmd compile exec:java"

echo [2/2] Dang khoi dong Frontend React Vite (React 19 - Port 5173)...
start "Virtual Tune - Frontend (React Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =========================================================================
echo   DA KHOI DONG THANH CONG!
echo   - Backend API          : http://localhost:8080
echo   - Frontend Application : http://localhost:5173
echo =========================================================================
echo   (Ban co the dong cua so nay, 2 tien trinh van dang chay trong 2 terminal rieng)
pause
