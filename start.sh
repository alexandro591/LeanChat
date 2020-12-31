#!/bin/bash

# GET CURRENT SCRIPT DIRECTORY PATH
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"

python3 -m pip install -r "$DIR"/ChatServer/requirements.txt
npm --prefix "$DIR"/TelegramBot/ install "$DIR"/TelegramBot/
pm2 start python3 --name "ChatServer" -- "$DIR"/ChatServer/main.py
pm2 start node --name "Bot" -- "$DIR"/TelegramBot/bot.js
pm2 startup;
pm2 save;