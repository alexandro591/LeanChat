#!/bin/bash

DIR="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "$1"

if [ "$1" == "--build" ]; then
  cd "${DIR}/ChatApp/public/app"
  npm install
  npm run build
  exit 0
fi

if [ "$1" == "--stop" ]; then
  pm2 stop "LeanChatServer"
  pm2 flush "LeanChatServer"
  pm2 delete "LeanChatServer"
  pm2 stop "LeanChatApp"
  pm2 flush "LeanChatApp"
  pm2 delete "LeanChatApp"

  pm2 save --force
  exit 0
fi

cd "${DIR}/Server"
npm install
pm2 start main.js --name "LeanChatServer"

cd "${DIR}/ChatApp"
npm install
pm2 start ./bin/www --name "LeanChatApp"

cd "./public/app"
npm install
npm run build

pm2 startup
pm2 save
