setlocal
cd /d %~dp0

if "%*"=="--build" (
    cd "./ChatApp/public/app"
    call npm run build
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