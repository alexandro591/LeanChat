@REM npm i -g node-gyp
@REM npm i -g pm2
@REM py -m pip install -r %~dp0ChatServer\requirements.txt
@REM npm --prefix %~dp0TelegramBot\ install %~dp0TelegramBot\
pm2 start py --name "ChatServer" -- %~dp0ChatServer\main.py
pm2 start node --name "Bot" -- %~dp0TelegramBot\bot.js