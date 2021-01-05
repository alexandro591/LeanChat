pm2 stop "LeanChatServer"
pm2 flush "LeanChatServer"
pm2 delete "LeanChatServer"
pm2 stop "LeanChatApp"
pm2 flush "LeanChatApp"
pm2 delete "LeanChatApp"

pm2 save --force