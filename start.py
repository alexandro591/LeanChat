import os

DIR = os.path.dirname(os.path.realpath(__file__))

os.system(f"npm install --prefix \"{DIR}/Server/\" \"{DIR}/Server/\"")
os.system(f"npm install --prefix \"{DIR}/ChatApp/\" \"{DIR}/ChatApp/\"")
os.system(f"pm2 start node --name \"LeanChatServer\" -- \"{DIR}/Server/main.js\"")
os.system(f"pm2 start npm --name \"LeanChatApp\" -- start --prefix \"{DIR}/ChatApp\"")
os.system("pm2 startup")
os.system("pm2 save")