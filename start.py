import os

DIR = os.path.dirname(os.path.realpath(__file__))
OS_NAME = os.name
COMMANDS = [
    f"cd \"{DIR}/Server/",
    "npm install",
    f"cd \"{DIR}/ChatApp/",
    "npm install"
    f"pm2 start node --name \"LeanChatServer\" -- \"{DIR}/Server/main.js\"",
    f"pm2 start npm --name \"LeanChatApp\" -- start --prefix \"{DIR}/ChatApp\"",
    "pm2 startup",
    "pm2 save"
]

for command in COMMANDS:
    os.system(command)
    if OS_NAME == "nt":
        # os.system(command.replace("/", "\\"))
        print(command.replace("/", "\\"))
    else:
        # os.system(command)
        print(command)