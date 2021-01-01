pm2 stop "LeanChatServer";
pm2 flush "LeanChatServer"
pm2 delete "LeanChatServer";
pm2 save --force;