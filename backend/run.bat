@echo off
echo Stopping existing Java processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting Virtual Tune Backend (Java 25)...
set JAVA_HOME=C:\Program Files\Java\jdk-25
set JAR=target\virtual-tune-backend-1.0.0-SNAPSHOT.jar

"%JAVA_HOME%\bin\java.exe" --enable-native-access=ALL-UNNAMED -jar "%JAR%"
