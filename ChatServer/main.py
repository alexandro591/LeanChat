import asyncio
import websockets
import json
import requests
import os
import telegram

class TelegramRooms():
    def __init__(self, token, name, bot):
        self.token = token
        self.name = name
        self.bot = bot
        self.isBusy = False

#initialize variables
path = os.path.abspath(__file__).replace("/main.py","")
bots_list = {}
sessions = {}
PORT = 9000
with open(path + '/../environment.json') as bots_file:
    environment = json.load(bots_file)
    chat_ids = environment["chat_ids"]
    for i in environment["bots"]:
        print(i)
        bot = telegram.Bot(environment["bots"][i]["token"])
        name = environment["bots"][i]["name"]
        token = environment["bots"][i]["token"]
        bots_list[name] = TelegramRooms(token, name, bot)

#balancer
async def chatBalancer(msg):
    key = msg.get("key")
    room = msg.get("room")
    session = sessions.get(key)
    if not room:
        if not session.get("room"):
            for room in bots_list:
                if not bots_list[room].isBusy:
                    print("Assigning to", bots_list[room].name)
                    sessions[key]["room"] = bots_list[room].name
                    bots_list[room].isBusy = True

                    for chat_id in chat_ids:
                        try:
                            bots_list[room].bot.send_message(chat_id=chat_id, text=msg["message"])
                        except:
                            print(chat_id, "not subscribed for this chat")
                    break
        else:
            for chat_id in chat_ids:
                try:
                    await bots_list[session["room"]].bot.send_message(chat_id=chat_id, text=msg["message"])
                except:
                    print(chat_id, "not subscribed for this chat")
    else:
        for key in sessions:
            if sessions[key].get("room") == room:
                await sessions[key]["websocket"].send(json.dumps(msg))

#register new chat
async def register(websocket, path):
    key = websocket.request_headers["Sec-WebSocket-Key"]
    print("New connection from",  key)
    sessions[key] = {}
    sessions[key]["key"] = key
    sessions[key]["websocket"] = websocket
    while True:
        await chat(websocket, path)

#new chat message received
async def chat(websocket, path):
    key = websocket.request_headers["Sec-WebSocket-Key"]
    message = json.loads(await websocket.recv())
    print("\n\nMessage received from", key, "---MESSAGE---:", message)
    await chatBalancer({
        **message,
        "key" : key
    })
    print(f"< {message}")


start_chat = websockets.serve(register, port = PORT)

asyncio.get_event_loop().run_until_complete(start_chat)
asyncio.get_event_loop().run_forever()
