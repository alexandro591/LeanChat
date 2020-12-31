#!/bin/bash

DIR = $(dirname $(readlink -f $0))

python3 -m pip install -r "$DIR"/ChatServer/requirements.txt
npm --prefix "$DIR"/TelegramBot/ install "$DIR"/TelegramBot/
pm2 start python3 --name "ChatServer" -- "$DIR"/ChatServer/main.py
pm2 start node --name "Bot" -- "$DIR"/TelegramBot/bot.js
pm2 startup;
pm2 save;