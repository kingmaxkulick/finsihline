@echo off
echo Waiting for vehicle systems to initialize (15 seconds)...
timeout /t 5 /nobreak
start "" "C:\Users\Dash\Documents\single-app-final-app\electron-dist\win-unpacked\Vehicle Dashboard.exe"