setlocal
cd /d %~dp0

cd "./Server"
call npm install
call pm2 start main.js --name "LeanChatServer"

cd "../ChatApp"
call npm install
call pm2 start ./bin/www --name "LeanChatApp"

call pm2 startup
call pm2 save