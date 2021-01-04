import os

os.system("pm2 stop \"LeanChatServer\"")
os.system("pm2 flush \"LeanChatServer\"")
os.system("pm2 delete \"LeanChatServer\"")
os.system("pm2 stop \"LeanChatApp\"")
os.system("pm2 flush \"LeanChatApp\"")
os.system("pm2 delete \"LeanChatApp\"")
os.system("pm2 save --force")