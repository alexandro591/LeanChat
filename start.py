import os

DIR = os.path.dirname(os.path.realpath(__file__))


os.chdir(f"{DIR}/Server")
os.system("npm install")
os.system(f"pm2 start main.js --name \"LeanChatServer\"")

os.chdir(f"{DIR}/ChatApp")
os.system("npm install")
os.system(f"pm2 start ./bin/www --name \"LeanChatApp\"")

os.system("pm2 startup")
os.system("pm2 save")