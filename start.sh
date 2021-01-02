#!/bin/bash

DIR="$(dirname "$(readlink -f "$0")")"

npm --prefix "$DIR"/Server/ install "$DIR"/Server/
npm --prefix "$DIR"/ChatApp/ install "$DIR"/ChatApp/
pm2 start node --name "LeanChatServer" -- "$DIR"/Server/main.js
pm2 start npm --name "LeanChatApp" -- start -- prefix "$DIR"/ChatApp
pm2 startup
pm2 save