python3 -m pip install -r $(pwd)/ChatServer/requirements.txt
npm install $(pwd)/TelegramBot/bot.js
pm2 start python3 --name "ChatServer" -- $(pwd)/ChatServer/main.py
pm2 start node --name "Bot" -- $(pwd)/TelegramBot/bot.js