setlocal
@echo off
cd /d %~dp0

if "%*"=="--build" (
    cd "./ChatApp/public/app"
    call npm run build
    exit /b 1
)

if "%*"=="--stop" (
call pm2 stop "LeanChatServer"
    call pm2 flush "LeanChatServer"
    call pm2 delete "LeanChatServer"
    call pm2 stop "LeanChatApp"
    call pm2 flush "LeanChatApp"
    call pm2 delete "LeanChatApp"

    call pm2 save --force
    exit /b 1
)

if "%*"=="--restart" (
call pm2 stop "LeanChatServer"
    call pm2 restart "LeanChatServer"
    call pm2 restart "LeanChatApp"

    exit /b 1
)

cd "./Server"
call npm install
call pm2 start main.js --name "LeanChatServer"

cd "../ChatApp"
call npm install
call pm2 start ./bin/www --name "LeanChatApp"

cd "./public/app"
call npm run build

call pm2 startup
call pm2 save