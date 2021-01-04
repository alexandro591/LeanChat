import os

DIR = os.path.dirname(os.path.realpath(__file__))
OS_NAME = os.name
COMMANDS = [
    f"npm install --prefix \"{DIR}/Server/\" \"{DIR}/Server/\"",
    f"npm install --prefix \"{DIR}/ChatApp/\" \"{DIR}/ChatApp/\"",
    f"pm2 start node --name \"LeanChatServer\" -- \"{DIR}/Server/main.js\"",
    f"pm2 start npm --name \"LeanChatApp\" -- start --prefix \"{DIR}/ChatApp\"",
    "pm2 startup",
    "pm2 save"
]

for command in COMMANDS:
    if OS_NAME == "nt":
        os.system(command.replace("/", "\\"))
    else:
        os.system(command)
