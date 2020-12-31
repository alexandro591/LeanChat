#!/bin/bash

function absoluteScriptDirPath {
    SOURCE = $(if [ -z "${BASH_SOURCE[0]}"]; then echo $1; else echo ${BASH_SOURCE[0]}; fi)
    while [ -h "$SOURCE" ]; do
      DIR = $( cd -P $( dirname "$SOURCE") && pwd )
      SOURCE = $(readlink "$SOURCE")
      [[ $SOURCE != /* ]] && SOURCE = "$DIR/$SOURCE"
    done
    DIR = $( cd -P $( dirname "$SOURCE" ) && pwd )
    echo $DIR
}

DIR = $(absoluteScriptDirPath $0)

python3 -m pip install -r "$DIR"/ChatServer/requirements.txt
npm --prefix "$DIR"/TelegramBot/ install "$DIR"/TelegramBot/
pm2 start python3 --name "ChatServer" -- "$DIR"/ChatServer/main.py
pm2 start node --name "Bot" -- "$DIR"/TelegramBot/bot.js
pm2 startup;
pm2 save;