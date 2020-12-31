python3 -m pip install $(pwd)/ChatServer/requirements.txt
pm2 start python3 --name "ChatServer" -- $(pwd)/ChatServer/main.py
pm2 start node --name "Bot" -- $(pwd)/TelegramBot/bot.js