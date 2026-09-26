@echo off
title VIRTUAL TUNE - Smart Dev Launcher
cd /d "%~dp0"

echo =========================================================================
echo       KHOI DONG HE THONG VIRTUAL TUNE (BACKEND + FRONTEND)
echo =========================================================================
echo.

:: -------------------------------------------------------------------------
:: 0. CHO PHEP NGUOI DUNG LUA CHON (MAC DINH ENTER LA Y)
:: -------------------------------------------------------------------------
if "%1"=="--auto" goto :CHECK_JAVA

set "START_APP=Y"
set /p START_APP="Ban co muon khoi dong he thong Virtual Tune khong? [Y/n] (Nhan Enter de Khoi dong): "
if /i "%START_APP%"=="N" goto :CANCELLED
echo.

:CHECK_JAVA
:: -------------------------------------------------------------------------
:: 1. KIEM TRA VA NAP JAVA (JDK 25)
:: -------------------------------------------------------------------------
echo [*] Kiem tra moi truong Java...
if exist "C:\Program Files\Java\jdk-25\bin\java.exe" call :SET_JAVA_PATH

where java >nul 2>nul
if errorlevel 1 goto :INSTALL_JAVA
echo [OK] Da tim thay Java tren he thong.
goto :CHECK_NODE

:INSTALL_JAVA
echo [CANH BAO] May ban chua co Java (JDK 25).
set "AUTO_JAVA=Y"
set /p AUTO_JAVA="Ban co muon tu dong cai dat Oracle JDK 25 khong? [Y/n] (Nhan Enter de Cai): "
if /i "%AUTO_JAVA%"=="N" (
    echo [BO QUA] Da bo qua cai dat Java. Backend co the se khong the chay!
    goto :CHECK_NODE
)
echo Dang tai va cai dat Oracle JDK 25 qua Windows Winget...
winget install Oracle.JDK.25 --accept-package-agreements --accept-source-agreements
if exist "C:\Program Files\Java\jdk-25\bin\java.exe" call :SET_JAVA_PATH

where java >nul 2>nul
if errorlevel 1 goto :RELOAD_SYS
echo [OK] Da cai dat va nap Java 25 thanh cong!

:: -------------------------------------------------------------------------
:: 2. KIEM TRA VA NAP NODE.JS / NPM
:: -------------------------------------------------------------------------
:CHECK_NODE
echo [*] Kiem tra moi truong Node.js / NPM...
if exist "C:\Program Files\nodejs\node.exe" call :SET_NODE_PATH

where node >nul 2>nul
if errorlevel 1 goto :INSTALL_NODE
echo [OK] Da tim thay Node.js tren he thong.
goto :CHECK_FRONTEND_DEPS

:INSTALL_NODE
echo [CANH BAO] May ban chua cai Node.js.
set "AUTO_NODE=Y"
set /p AUTO_NODE="Ban co muon tu dong cai dat Node.js LTS khong? [Y/n] (Nhan Enter de Cai): "
if /i "%AUTO_NODE%"=="N" (
    echo [BO QUA] Da bo qua cai dat Node.js. Frontend co the se khong the chay!
    goto :CHECK_FRONTEND_DEPS
)
echo Dang tai va cai dat Node.js LTS qua Windows Winget...
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
if exist "C:\Program Files\nodejs\node.exe" call :SET_NODE_PATH

where node >nul 2>nul
if errorlevel 1 goto :RELOAD_SYS
echo [OK] Da cai dat va nap Node.js thanh cong!

:: -------------------------------------------------------------------------
:: 3. KIEM TRA VA TU DONG CAI DEPENDENCIES CHO FRONTEND (npm install)
:: -------------------------------------------------------------------------
:CHECK_FRONTEND_DEPS
if exist "%~dp0frontend\node_modules" goto :START_SERVICES
echo.
echo [THONG BAO] Phat hien Frontend chua cai thu vien - Dang tu dong chay npm install...
cd /d "%~dp0frontend"
call npm install
cd /d "%~dp0"
echo [OK] Da cai dat xong thu vien Frontend!

:: -------------------------------------------------------------------------
:: 4. KHOI DONG BACKEND VA FRONTEND
:: -------------------------------------------------------------------------
:START_SERVICES
echo.
echo [1/2] Dang mo cua so Backend Spring Boot (Java 25 - Port 8080)...
start "Virtual Tune - Backend (Spring Boot)" /D "%~dp0backend" cmd /k "mvnw.cmd compile exec:java"

echo [2/2] Dang mo cua so Frontend React Vite (React 19 - Port 5173)...
start "Virtual Tune - Frontend (React Vite)" /D "%~dp0frontend" cmd /k "npm run dev"

echo.
echo =========================================================================
echo   DA KHOI DONG HE THONG THANH CONG!
echo   - Backend API          : http://localhost:8080
echo   - Frontend Application : http://localhost:5173
echo =========================================================================
echo   (2 ung dung dang chay trong 2 terminal rieng tren man hinh)
echo.
echo [3/3] Dang tu dong mo ung dung tren trinh duyet...
timeout /t 3 /nobreak >nul 2>nul
start http://localhost:5173
echo.
echo Cua so dieu khien nay se tu dong dong sau 7 giay...
timeout /t 7 /nobreak >nul 2>nul
exit

:: -------------------------------------------------------------------------
:: SUBROUTINES VA XU LY PHU
:: -------------------------------------------------------------------------
:SET_JAVA_PATH
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
set "PATH=C:\Program Files\Java\jdk-25\bin;%PATH%"
goto :eof

:SET_NODE_PATH
set "PATH=C:\Program Files\nodejs;%PATH%"
goto :eof

:RELOAD_SYS
echo [THONG BAO] Dang tu dong khoi dong lai de cap nhat he thong...
start "" "%~f0" --auto
exit

:CANCELLED
echo.
echo Da huy khoi dong theo yeu cau cua ban(tu dong tat sau 5 giay).
timeout /t 5 /nobreak >nul 2>nul
exit /b
