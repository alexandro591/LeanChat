#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

python3 -m pip install -r $(DIR)/ChatServer/requirements.txt
npm install $(DIR)/TelegramBot/
pm2 start python3 --name "ChatServer" -- $(DIR)/ChatServer/main.py
pm2 start node --name "Bot" -- $(DIR)/TelegramBot/bot.js
pm2 startup;
pm2 save;