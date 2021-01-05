call pm2 stop "LeanChatServer"
call pm2 flush "LeanChatServer"
call pm2 delete "LeanChatServer"
call pm2 stop "LeanChatApp"
call pm2 flush "LeanChatApp"
call pm2 delete "LeanChatApp"

call pm2 save --force