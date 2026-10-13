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
echo [*] Kiem tra moi truong Java 25 (Spring Boot Backend)...

:: Quet tim thu muc JDK 25 tren may
set "FOUND_JDK25="

:: 1. Kiem tra thu muc mac dinh cua Oracle JDK
for /d %%i in ("C:\Program Files\Java\jdk-25*") do (
    if exist "%%i\bin\java.exe" set "FOUND_JDK25=%%i"
)

:: 2. Kiem tra thu muc Eclipse Adoptium / Temurin / Microsoft
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

:: 3. Kiem tra tu Registry
if "%FOUND_JDK25%"=="" (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\25" /v JavaHome 2^>nul') do (
        if exist "%%b\bin\java.exe" set "FOUND_JDK25=%%b"
    )
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\25.0.1" /v JavaHome 2^>nul') do (
        if exist "%%b\bin\java.exe" set "FOUND_JDK25=%%b"
    )
)

:: Neu tim thay thu muc JDK 25 thi nap ngay vao phien lam viec
if not "%FOUND_JDK25%"=="" (
    set "JAVA_HOME=%FOUND_JDK25%"
    set "PATH=%FOUND_JDK25%\bin;%PATH%"
    echo [OK] Da tim thay va nap Java 25: %FOUND_JDK25%
    goto :CHECK_NODE
)

:: Neu chua tim thay bang thu muc, kiem tra lenh java hien tai co phai ban 25 khong
where java >nul 2>nul
if not errorlevel 1 (
    java -version 2>&1 | findstr /c:"25." >nul 2>nul
    if not errorlevel 1 (
        echo [OK] Da tim thay Java 25 tren he thong.
        goto :CHECK_NODE
    )
)

:INSTALL_JAVA
echo [CANH BAO] May ban chua co Java 25 (Spring Boot 3.5 yeu cau JDK 25).
set "AUTO_JAVA=Y"
set /p AUTO_JAVA="Ban co muon tu dong cai dat Oracle JDK 25 qua Winget khong? [Y/n] (Nhan Enter de Cai): "
if /i "%AUTO_JAVA%"=="N" (
    echo [BO QUA] Da bo qua cai dat Java 25. Backend co the se gap loi 'release version 25 not supported'!
    goto :CHECK_NODE
)

echo Dang tai va cai dat Oracle JDK 25 qua Windows Winget...
winget install Oracle.JDK.25 --accept-package-agreements --accept-source-agreements

:: Sau khi winget cai xong, quet lai thu muc JDK 25
for /d %%i in ("C:\Program Files\Java\jdk-25*") do (
    if exist "%%i\bin\java.exe" set "FOUND_JDK25=%%i"
)
if "%FOUND_JDK25%"=="" (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\JavaSoft\JDK\25" /v JavaHome 2^>nul') do (
        if exist "%%b\bin\java.exe" set "FOUND_JDK25=%%b"
    )
)

:: Neu da tim thay thi nap ngay va setx de luu vinh vien cho may nguoi dung
if not "%FOUND_JDK25%"=="" (
    set "JAVA_HOME=%FOUND_JDK25%"
    set "PATH=%FOUND_JDK25%\bin;%PATH%"
    setx JAVA_HOME "%FOUND_JDK25%" >nul 2>nul
    echo [OK] Da cai dat va nap Java 25 thanh cong tai: %FOUND_JDK25%!
    goto :CHECK_NODE
)

:: Neu van chua thay, thu nap lai toan bo PATH tu Registry
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
set "PATH=%SYS_PATH%;%USER_PATH%;%PATH%"

where java >nul 2>nul
if errorlevel 1 (
    echo [LOI] Khong the tu dong nhan dien Java 25 sau khi cai.
    echo Vui long mo lai file nay hoac tai thu cong tai: https://www.oracle.com/java/technologies/downloads/#java25
    pause
    exit /b
)
echo [OK] Da cai dat va nap Java 25 thanh cong!

:: -------------------------------------------------------------------------
:: -------------------------------------------------------------------------
:: 2. KIEM TRA VA NAP NODE.JS / NPM
:: -------------------------------------------------------------------------
:CHECK_NODE
echo [*] Kiem tra moi truong Node.js / NPM (Frontend React)...

set "FOUND_NODE="
if exist "C:\Program Files\nodejs\node.exe" set "FOUND_NODE=C:\Program Files\nodejs"
if "%FOUND_NODE%"=="" if exist "C:\Program Files (x86)\nodejs\node.exe" set "FOUND_NODE=C:\Program Files (x86)\nodejs"
if "%FOUND_NODE%"=="" if exist "%LOCALAPPDATA%\Programs\node\node.exe" set "FOUND_NODE=%LOCALAPPDATA%\Programs\node"

if not "%FOUND_NODE%"=="" (
    set "PATH=%FOUND_NODE%;%PATH%"
)

where node >nul 2>nul
if not errorlevel 1 (
    for /f "tokens=*" %%g in ('node -v 2^>nul') do echo [OK] Da tim thay Node.js %%g tren he thong.
    goto :CHECK_FRONTEND_DEPS
)

:INSTALL_NODE
echo [CANH BAO] May ban chua co Node.js (Frontend React yeu cau Node.js LTS).
set "AUTO_NODE=Y"
set /p AUTO_NODE="Ban co muon tu dong cai dat Node.js LTS qua Winget khong? [Y/n] (Nhan Enter de Cai): "
if /i "%AUTO_NODE%"=="N" (
    echo [BO QUA] Da bo qua cai dat Node.js. Frontend co the se khong the chay!
    goto :CHECK_FRONTEND_DEPS
)

where winget >nul 2>nul
if errorlevel 1 (
    echo [LOI] May ban chua co Windows Winget de tu dong cai.
    echo Vui long tai va cai dat Node.js LTS thu cong tai: https://nodejs.org/
    pause
    goto :CHECK_FRONTEND_DEPS
)

echo Dang tai va cai dat Node.js LTS qua Windows Winget...
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements

:: Quet lai thu muc Node.js sau khi cai
if exist "C:\Program Files\nodejs\node.exe" set "FOUND_NODE=C:\Program Files\nodejs"
if "%FOUND_NODE%"=="" if exist "C:\Program Files (x86)\nodejs\node.exe" set "FOUND_NODE=C:\Program Files (x86)\nodejs"

if not "%FOUND_NODE%"=="" (
    set "PATH=%FOUND_NODE%;%PATH%"
    setx PATH "%PATH%;%FOUND_NODE%" >nul 2>nul
    for /f "tokens=*" %%g in ('node -v 2^>nul') do echo [OK] Da cai dat va nap Node.js %%g thanh cong!
    goto :CHECK_FRONTEND_DEPS
)

:: Neu chua thay, nap lai PATH tu Registry
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
set "PATH=%SYS_PATH%;%USER_PATH%;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
    echo [LOI] Khong the tu dong nhan dien Node.js sau khi cai.
    echo Vui long mo lai file nay hoac cai dat thu cong tai: https://nodejs.org/
    pause
    goto :CHECK_FRONTEND_DEPS
)
echo [OK] Da cai dat va nap Node.js thanh cong!

:: -------------------------------------------------------------------------
:: 3. KIEM TRA VA TU DONG CAI DEPENDENCIES CHO FRONTEND (npm install)
:: -------------------------------------------------------------------------
:CHECK_FRONTEND_DEPS
if exist "%~dp0frontend\node_modules\vite" goto :START_SERVICES
echo.
echo [THONG BAO] Phat hien Frontend chua cai thu vien - Dang tu dong chay npm install...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
    echo [CANH BAO] npm install gap canh bao xung dot, dang thu lai voi --legacy-peer-deps...
    call npm install --legacy-peer-deps
)
cd /d "%~dp0"
echo [OK] Da cai dat xong thu vien Frontend!

:: -------------------------------------------------------------------------
:: 4. KHOI DONG BACKEND VA FRONTEND
:: -------------------------------------------------------------------------
:START_SERVICES
echo.
echo [1/2] Dang mo cua so Backend Spring Boot (Java 25 - Port 8080)...
start "Virtual Tune - Backend (Spring Boot)" /D "%~dp0backend" cmd /k "set \"JAVA_HOME=%JAVA_HOME%\" && set \"PATH=%JAVA_HOME%\bin;%%PATH%%\" && echo [*] Dang khoi dong Spring Boot Backend (Java 25)... && mvnw.cmd compile exec:java"

echo [2/2] Dang mo cua so Frontend React Vite (React 19 - Port 5173)...
start "Virtual Tune - Frontend (React Vite)" /D "%~dp0frontend" cmd /k "set \"PATH=%PATH%\" && echo [*] Dang khoi dong Vite Dev Server (React 19)... && npm run dev"

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
echo Cua so dieu khien nay se tu dong dong sau 5 giay...
timeout /t 5 /nobreak >nul 2>nul
exit

:: -------------------------------------------------------------------------
:: SUBROUTINES VA XU LY PHU
:: -------------------------------------------------------------------------
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
echo [THONG BAO] Dang tu dong khoi dong lai de cap nhat he thong...
start "" "%~f0" --auto
exit

:CANCELLED
echo.
echo Da huy khoi dong theo yeu cau cua ban(tu dong tat sau 5 giay).
timeout /t 5 /nobreak >nul 2>nul
exit /b
