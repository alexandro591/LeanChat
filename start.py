import os

DIR = os.path.dirname(os.path.realpath(__file__))


os.chdir(f"{DIR}/Server")
os.system("npm install")
os.system(f"pm2 start main.js --name \"LeanChatServer\"")

os.chdir(f"{DIR}/ChatApp")
os.system("npm install")
os.system(f"pm2 start npm --name \"LeanChatApp\" -- start")

os.system("pm2 startup")
ps.system("pm2 save")