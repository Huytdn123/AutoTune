@echo off
setlocal DisableDelayedExpansion
title VIRTUAL TUNE - Automotive Development Console
cd /d "%~dp0"

:: =========================================================================
:: TERMINAL INITIALIZATION & ANSI COLOR SETUP WITH SAFE FALLBACK
:: =========================================================================
mode con: cols=80 lines=32 >nul 2>nul
reg add HKCU\Console /v VirtualTerminalLevel /t REG_DWORD /d 1 /f >nul 2>nul

set "ESC="
for /f "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do set "ESC=%%b"

if not "%ESC%"=="" (
    set "C_RESET=%ESC%[0m"
    set "C_BOLD=%ESC%[1m"
    set "C_BLUE=%ESC%[94m"
    set "C_CYAN=%ESC%[96m"
    set "C_GREEN=%ESC%[92m"
    set "C_YELLOW=%ESC%[93m"
    set "C_RED=%ESC%[91m"
    set "C_GRAY=%ESC%[90m"
    set "C_WHITE=%ESC%[97m"
) else (
    set "C_RESET="
    set "C_BOLD="
    set "C_BLUE="
    set "C_CYAN="
    set "C_GREEN="
    set "C_YELLOW="
    set "C_RED="
    set "C_GRAY="
    set "C_WHITE="
)

:: Padded status tags (strictly 11 chars wide) for aligned columnar output
set "TAG_OK=%C_GREEN%[ OK ]     %C_RESET%"
set "TAG_INFO=%C_CYAN%[ INFO ]   %C_RESET%"
set "TAG_WARN=%C_YELLOW%[ WARN ]   %C_RESET%"
set "TAG_ERROR=%C_RED%[ ERROR ]  %C_RESET%"
set "TAG_WAIT=%C_CYAN%[ WAIT ]   %C_RESET%"
set "TAG_PROMPT=%C_YELLOW%[ ? ]      %C_RESET%"

echo.
echo %C_CYAN%+----------------------------------------------------------------+%C_RESET%
echo %C_CYAN%^|%C_BOLD%%C_BLUE%                          VIRTUAL TUNE                          %C_RESET%%C_CYAN%^|%C_RESET%
echo %C_CYAN%^|%C_WHITE%                 AUTOMOTIVE DEVELOPMENT CONSOLE                 %C_RESET%%C_CYAN%^|%C_RESET%
echo %C_CYAN%^|%C_GRAY%                   SMART ENVIRONMENT LAUNCHER                   %C_RESET%%C_CYAN%^|%C_RESET%
echo %C_CYAN%+----------------------------------------------------------------+%C_RESET%

:: =========================================================================
:: 0. XAC NHAN KHOI DONG (ENTER DE TIEP TUC, N DE HUY)
:: =========================================================================
if "%1"=="--auto" goto :CHECK_JAVA

echo.
echo %TAG_INFO%Nhan Enter de bat dau kiem tra va khoi chay he thong.
set "START_APP=Y"
set /p START_APP=%TAG_PROMPT%Khoi dong Virtual Tune ngay bay gio? [Y/n]: 
if /i "%START_APP%"=="N" goto :CANCELLED

:: =========================================================================
:: 1. KIEM TRA VA NAP MOI TRUONG JAVA 25 (SPRING BOOT BACKEND)
:: =========================================================================
:CHECK_JAVA
echo.
echo %C_CYAN%------------------------------------------------------------------%C_RESET%
echo %C_BOLD%%C_CYAN% [1/5] KIEM TRA MOI TRUONG JAVA 25 (SPRING BOOT BACKEND)%C_RESET%
echo %C_CYAN%------------------------------------------------------------------%C_RESET%

set "FOUND_JDK25="

:: 1. Quet thu muc mac dinh cua Oracle JDK 25
for /d %%i in ("C:\Program Files\Java\jdk-25*") do (
    if exist "%%i\bin\java.exe" set "FOUND_JDK25=%%i"
)

:: 2. Quet thu muc Eclipse Adoptium / Temurin / Microsoft
if "%FOUND_JDK25%"=="" (
    for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-25*") do (
        if exist "%%i\bin\java.exe" set "FOUND_JDK25=%%i"
    )
)
if "%FOUND_JDK25%"=="" (
    for /d %%i in ("C:\Program Files\Microsoft\jdk-25*") do (
        if exist "%%i\bin\java.exe" set "FOUND_JDK25=%%i"
    )
)

:: 3. Quet tu Registry Windows
if "%FOUND_JDK25%"=="" (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\25" /v JavaHome 2^>nul') do (
        if exist "%%b\bin\java.exe" set "FOUND_JDK25=%%b"
    )
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\25.0.1" /v JavaHome 2^>nul') do (
        if exist "%%b\bin\java.exe" set "FOUND_JDK25=%%b"
    )
)

:: Neu tim thay thu muc JDK 25 thi nap vao phien lam viec
if not "%FOUND_JDK25%"=="" (
    set "JAVA_HOME=%FOUND_JDK25%"
    set "PATH=%FOUND_JDK25%\bin;%PATH%"
    echo %TAG_OK%Java 25 da san sang tren he thong.
    echo %C_GRAY%           Thu muc: %FOUND_JDK25%%C_RESET%
    goto :CHECK_NODE
)

:: Neu chua tim thay thu muc, kiem tra lenh java tren PATH
where java >nul 2>nul
if not errorlevel 1 (
    java -version 2>&1 | findstr /c:"25." >nul 2>nul
    if not errorlevel 1 (
        echo %TAG_OK%Java 25 da san sang tren bien moi truong PATH.
        goto :CHECK_NODE
    )
)

:INSTALL_JAVA
echo %TAG_WARN%Chua phat hien Java 25 (Spring Boot 3.5 yeu cau JDK 25).
set "AUTO_JAVA=Y"
set /p AUTO_JAVA=%TAG_PROMPT%Tu dong cai Oracle JDK 25 qua Windows Winget? [Y/n]: 
if /i "%AUTO_JAVA%"=="N" (
    echo %TAG_WARN%Da bo qua cai dat Java 25. Backend co the gap loi.
    echo %TAG_INFO%Chuyen sang buoc tiep theo...
    goto :CHECK_NODE
)

echo %TAG_INFO%Dang tai va cai dat Oracle JDK 25 qua Windows Winget...
winget install Oracle.JDK.25 --accept-package-agreements --accept-source-agreements

for /d %%i in ("C:\Program Files\Java\jdk-25*") do (
    if exist "%%i\bin\java.exe" set "FOUND_JDK25=%%i"
)
if "%FOUND_JDK25%"=="" (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\25" /v JavaHome 2^>nul') do (
        if exist "%%b\bin\java.exe" set "FOUND_JDK25=%%b"
    )
)

if not "%FOUND_JDK25%"=="" (
    set "JAVA_HOME=%FOUND_JDK25%"
    set "PATH=%FOUND_JDK25%\bin;%PATH%"
    setx JAVA_HOME "%FOUND_JDK25%" >nul 2>nul
    echo %TAG_OK%Cai dat va nap Java 25 thanh cong.
    echo %C_GRAY%           Thu muc: %FOUND_JDK25%%C_RESET%
    goto :CHECK_NODE
)

for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
set "PATH=%SYS_PATH%;%USER_PATH%;%PATH%"

where java >nul 2>nul
if errorlevel 1 (
    echo %TAG_ERROR%Khong the tu dong nhan dien Java 25 sau khi cai dat.
    echo %TAG_INFO%Vui long tai va cai dat thu cong tai:
    echo %C_GRAY%           https://www.oracle.com/java/technologies/downloads/#java25%C_RESET%
    pause
    exit /b 1
)
echo %TAG_OK%Cai dat va nap Java 25 thanh cong.

:: =========================================================================
:: 2. KIEM TRA VA NAP MOI TRUONG NODE.JS VA NPM (FRONTEND REACT)
:: =========================================================================
:CHECK_NODE
echo.
echo %C_CYAN%------------------------------------------------------------------%C_RESET%
echo %C_BOLD%%C_CYAN% [2/5] KIEM TRA MOI TRUONG NODE.JS VA NPM (FRONTEND REACT)%C_RESET%
echo %C_CYAN%------------------------------------------------------------------%C_RESET%

set "FOUND_NODE="
if exist "C:\Program Files\nodejs\node.exe" set "FOUND_NODE=C:\Program Files\nodejs"
if "%FOUND_NODE%"=="" if exist "C:\Program Files (x86)\nodejs\node.exe" set "FOUND_NODE=C:\Program Files (x86)\nodejs"
if "%FOUND_NODE%"=="" if exist "%LOCALAPPDATA%\Programs\node\node.exe" set "FOUND_NODE=%LOCALAPPDATA%\Programs\node"

if not "%FOUND_NODE%"=="" (
    set "PATH=%FOUND_NODE%;%PATH%"
)

where node >nul 2>nul
if not errorlevel 1 (
    for /f "tokens=*" %%g in ('node -v 2^>nul') do (
        echo %TAG_OK%Node.js %%g da san sang tren he thong.
    )
    goto :CHECK_FRONTEND_DEPS
)

:INSTALL_NODE
echo %TAG_WARN%Chua phat hien Node.js (Frontend React yeu cau Node LTS).
set "AUTO_NODE=Y"
set /p AUTO_NODE=%TAG_PROMPT%Tu dong cai Node.js LTS qua Windows Winget? [Y/n]: 
if /i "%AUTO_NODE%"=="N" (
    echo %TAG_WARN%Da bo qua cai dat Node.js. Frontend co the khong chay.
    echo %TAG_INFO%Chuyen sang buoc tiep theo...
    goto :CHECK_FRONTEND_DEPS
)

where winget >nul 2>nul
if errorlevel 1 (
    echo %TAG_ERROR%Khong tim thay Windows Winget tren he thong.
    echo %TAG_INFO%Vui long tai va cai dat Node.js LTS thu cong tai:
    echo %C_GRAY%           https://nodejs.org/%C_RESET%
    pause
    goto :CHECK_FRONTEND_DEPS
)

echo %TAG_INFO%Dang tai va cai dat Node.js LTS qua Windows Winget...
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

if exist "C:\Program Files\nodejs\node.exe" set "FOUND_NODE=C:\Program Files\nodejs"
if "%FOUND_NODE%"=="" if exist "C:\Program Files (x86)\nodejs\node.exe" set "FOUND_NODE=C:\Program Files (x86)\nodejs"

if not "%FOUND_NODE%"=="" (
    set "PATH=%FOUND_NODE%;%PATH%"
    for /f "tokens=*" %%g in ('node -v 2^>nul') do (
        echo %TAG_OK%Cai dat va nap Node.js %%g thanh cong.
    )
    goto :CHECK_FRONTEND_DEPS
)

for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
set "PATH=%SYS_PATH%;%USER_PATH%;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
    echo %TAG_ERROR%Khong the tu dong nhan dien Node.js sau khi cai dat.
    echo %TAG_INFO%Vui long mo lai console hoac cai dat thu cong tai:
    echo %C_GRAY%           https://nodejs.org/%C_RESET%
    pause
    goto :CHECK_FRONTEND_DEPS
)
echo %TAG_OK%Cai dat va nap Node.js thanh cong.

:: =========================================================================
:: 3. KIEM TRA VA CAI DAT THU VIEN FRONTEND (NPM DEPENDENCIES)
:: =========================================================================
:CHECK_FRONTEND_DEPS
echo.
echo %C_CYAN%------------------------------------------------------------------%C_RESET%
echo %C_BOLD%%C_CYAN% [3/5] KIEM TRA THU VIEN FRONTEND (NPM DEPENDENCIES)%C_RESET%
echo %C_CYAN%------------------------------------------------------------------%C_RESET%

if exist "%~dp0frontend\node_modules\vite" (
    echo %TAG_OK%Thu vien frontend [node_modules] da san sang.
    goto :ALLOCATE_PORTS
)

echo %TAG_INFO%Chua co thu vien frontend. Dang tien hanh cai dat...
echo %TAG_WAIT%Dang chay npm install (co the mat 1-2 phut)...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
    echo %TAG_WARN%Thu lai voi co --legacy-peer-deps...
    call npm install --legacy-peer-deps
)
cd /d "%~dp0"

if exist "%~dp0frontend\node_modules\vite" (
    echo %TAG_OK%Cai dat xong toan bo thu vien frontend.
) else (
    echo %TAG_ERROR%Cai dat thu vien frontend that bai.
    echo %TAG_WARN%Tiep tuc thu khoi chay he thong...
)

:: =========================================================================
:: 4. PHAN BO CONG MANG (PORT CONFLICT RESOLVER)
:: =========================================================================
:ALLOCATE_PORTS
echo.
echo %C_CYAN%------------------------------------------------------------------%C_RESET%
echo %C_BOLD%%C_CYAN% [4/5] PHAN BO CONG MANG (PORT CONFLICT RESOLVER)%C_RESET%
echo %C_CYAN%------------------------------------------------------------------%C_RESET%

:: Kiem tra cong Backend (Khoi dau 8080 - quet ca IPv4 va IPv6)
set "BE_PORT=8080"
:LOOP_BE_PORT
netstat -ano | findstr /r ":%BE_PORT% " | findstr "LISTENING" >nul 2>nul
if not errorlevel 1 (
    echo %TAG_WARN%Cong Backend %BE_PORT% dang bi chiem boi ung dung khac.
    set /a BE_PORT+=1
    goto :LOOP_BE_PORT
)
if not "%BE_PORT%"=="8080" (
    echo %TAG_INFO%Chuyen Backend Spring Boot sang cong moi: %C_BOLD%%C_GREEN%%BE_PORT%%C_RESET%
) else (
    echo %TAG_OK%Cong Backend 8080 san sang hoat dong.
)

:: Kiem tra cong Frontend (Khoi dau 5173, tranh trung voi BE_PORT - quet ca IPv4 va IPv6)
set "FE_PORT=5173"
:LOOP_FE_PORT
if "%FE_PORT%"=="%BE_PORT%" (
    set /a FE_PORT+=1
    goto :LOOP_FE_PORT
)
netstat -ano | findstr /r ":%FE_PORT% " | findstr "LISTENING" >nul 2>nul
if not errorlevel 1 (
    echo %TAG_WARN%Cong Frontend %FE_PORT% dang bi chiem boi ung dung khac.
    set /a FE_PORT+=1
    goto :LOOP_FE_PORT
)
if not "%FE_PORT%"=="5173" (
    echo %TAG_INFO%Chuyen Frontend React Vite sang cong moi: %C_BOLD%%C_GREEN%%FE_PORT%%C_RESET%
) else (
    echo %TAG_OK%Cong Frontend 5173 san sang hoat dong.
)

:: =========================================================================
:: 5. KHOI DONG DICH VU VA DONG BO HE THONG
:: =========================================================================
:START_SERVICES
echo.
echo %C_CYAN%------------------------------------------------------------------%C_RESET%
echo %C_BOLD%%C_CYAN% [5/5] KHOI DONG DICH VU VA DONG BO HE THONG%C_RESET%
echo %C_CYAN%------------------------------------------------------------------%C_RESET%

:: Ghi file moi truong frontend de Vite ket noi Backend dung cong thuc te
echo VITE_BACKEND_PORT=%BE_PORT%> "%~dp0frontend\.env.local"
echo VITE_PORT=%FE_PORT%>> "%~dp0frontend\.env.local"
echo PORT=%FE_PORT%>> "%~dp0frontend\.env.local"

echo %TAG_INFO%Khoi dong Backend Spring Boot (Java 25 - Port %BE_PORT%)...
start "Virtual Tune - Backend (Spring Boot :%BE_PORT%)" /D "%~dp0backend" cmd /k "set JAVA_HOME=%JAVA_HOME%& set PATH=%JAVA_HOME%\bin;%%PATH%%& set SERVER_PORT=%BE_PORT%& echo [*] Dang khoi dong Spring Boot Backend tren cong %BE_PORT%...& mvnw.cmd compile exec:java -Dexec.args="--server.port=%BE_PORT%" -Dserver.port=%BE_PORT%"

echo %TAG_INFO%Khoi dong Frontend React Vite (React 19 - Port %FE_PORT%)...
start "Virtual Tune - Frontend (React Vite :%FE_PORT%)" /D "%~dp0frontend" cmd /k "set PATH=%PATH%& set VITE_PORT=%FE_PORT%& set VITE_BACKEND_PORT=%BE_PORT%& echo [*] Dang khoi dong Vite Dev Server tren cong %FE_PORT% (Proxy toi Backend :%BE_PORT%)...& npx vite --port %FE_PORT%"

echo.
echo %C_GREEN%+----------------------------------------------------------------+%C_RESET%
echo %C_GREEN%^|%C_BOLD%%C_WHITE%                  HE THONG SAN SANG HOAT DONG                   %C_RESET%%C_GREEN%^|%C_RESET%
echo %C_GREEN%+----------------------------------------------------------------+%C_RESET%
echo   %C_BOLD%%C_WHITE%* Frontend Web App :%C_RESET% %C_CYAN%http://localhost:%FE_PORT%%C_RESET%
echo   %C_BOLD%%C_WHITE%* Backend REST API :%C_RESET% %C_GREEN%http://localhost:%BE_PORT%%C_RESET%
echo   %C_BOLD%%C_WHITE%* H2 Database GUI  :%C_RESET% %C_YELLOW%http://localhost:%BE_PORT%/h2-console%C_RESET%
echo %C_GREEN%+----------------------------------------------------------------+%C_RESET%
echo %C_GREEN%^|%C_GRAY%         (Cac dich vu dang chay trong terminal rieng)           %C_RESET%%C_GREEN%^|%C_RESET%
echo %C_GREEN%+----------------------------------------------------------------+%C_RESET%
echo.

:: =========================================================================
:: CHO CAC DICH VU SAN SANG VA MO TRINH DUYET
:: =========================================================================
echo %TAG_WAIT%Dang cho Backend Spring Boot va Frontend React khoi dong...

set "BE_READY=0"
set "FE_READY=0"
set "WAIT_COUNT=0"

:WAIT_SERVICES_READY
timeout /t 1 /nobreak >nul 2>nul
set /a WAIT_COUNT+=1

:: Kiem tra Backend
if "%BE_READY%"=="0" (
    netstat -ano | findstr /r ":%BE_PORT% " | findstr "LISTENING" >nul 2>nul
    if not errorlevel 1 (
        set "BE_READY=1"
        echo %TAG_OK%Backend Spring Boot [Port %BE_PORT%] da san sang hoat dong!
    )
)

:: Kiem tra Frontend
if "%FE_READY%"=="0" (
    netstat -ano | findstr /r ":%FE_PORT% " | findstr "LISTENING" >nul 2>nul
    if not errorlevel 1 (
        set "FE_READY=1"
        echo %TAG_OK%Frontend React Vite [Port %FE_PORT%] da san sang hoat dong!
    )
)

:: Neu ca hai da san sang thi mo ngay trinh duyet
if "%BE_READY%"=="1" if "%FE_READY%"=="1" goto :ALL_SERVICES_UP

if %WAIT_COUNT% leq 60 goto :WAIT_SERVICES_READY

:ALL_SERVICES_UP
echo.
echo %TAG_INFO%Dang mo ung dung tren trinh duyet: http://localhost:%FE_PORT%
start http://localhost:%FE_PORT%
timeout /t 1 /nobreak >nul 2>nul
exit

:: =========================================================================
:: PHU TRO VA XU LY DIEU HUONG
:: =========================================================================
:SET_JAVA_PATH
if not "%FOUND_JDK25%"=="" (
    set "JAVA_HOME=%FOUND_JDK25%"
    set "PATH=%FOUND_JDK25%\bin;%PATH%"
) else (
    set "JAVA_HOME=C:\Program Files\Java\jdk-25"
    set "PATH=C:\Program Files\Java\jdk-25\bin;%PATH%"
)
goto :eof

:SET_NODE_PATH
set "PATH=C:\Program Files\nodejs;%PATH%"
goto :eof

:RELOAD_SYS
echo.
echo %TAG_INFO%Dang tu dong khoi dong lai de cap nhat he thong...
start "" "%~f0" --auto
exit

:CANCELLED
echo.
echo %TAG_WARN%Da huy qua trinh khoi dong theo yeu cau.
echo %C_GRAY%           Cua so se dong sau 3 giay...%C_RESET%
timeout /t 3 /nobreak >nul 2>nul
exit /b 0