pm2 stop "ChatServer";
pm2 stop "Bot";
pm2 flush "ChatServer"
pm2 flush "Bot"
pm2 delete "ChatServer";
pm2 delete "Bot";
pm2 save --force;