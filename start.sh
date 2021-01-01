#!/bin/bash

DIR="$(dirname "$(readlink -f "$0")")"

npm --prefix "$DIR"/Server/ install "$DIR"/Server/
pm2 start node --name "LeanChatServer" -- "$DIR"/Server/main.js
pm2 startup;
pm2 save;