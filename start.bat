setlocal
cd /d %~dp0

cd "./Server"
call npm install
call pm2 start main.js --name "LeanChatServer"

cd "../ChatApp"
call npm install
call pm2 start ./bin/www --name "LeanChatApp"

@REM new chat app --- next.js version
cd "../chat_app"
call npm install
call npm run build
call pm2 start starter.js --name "LeanChatApp2"

call pm2 startup
call pm2 save