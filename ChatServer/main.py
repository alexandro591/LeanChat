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

class ChatSession():
    def __init__(self, token, name, bot):
        self.token = token
        self.visitor_name = name
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
async def chatBalancer(message):
    key = message.get("key")
    room = message.get("room")
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
                            bots_list[room].bot.send_message(chat_id=chat_id, text=message["message"])
                        except:
                            print(chat_id, "not subscribed for this chat")
                    break
        else:
            for chat_id in chat_ids:
                try:
                    await bots_list[session["room"]].bot.send_message(chat_id=chat_id, text=message["message"])
                except:
                    print(chat_id, "not subscribed for this chat")
    else:
        for key in sessions:
            if sessions[key].get("room") == room:
                await sessions[key]["websocket"].send(json.dumps(message))
    

    if message.get("name") and (not session.get("name")):
        session["name"] = message["name"]

#register new chat
async def register(websocket, path):
    key = websocket.request_headers["Sec-WebSocket-Key"]
    print("New connection from",  key)
    sessions[key] = {
        "key" : key,
        "websocket" : websocket
    }
    await sessions[key]["websocket"].send(json.dumps({
        "type" : "ping",
        "message" : "successfully registered",
        "key" : key
    }))
    while True:
        await chat(websocket, path)

#new chat message received
async def chat(websocket, path):
    key = websocket.request_headers["Sec-WebSocket-Key"]
    message = json.loads(await websocket.recv())
    if message.get("type") == "message":
        print("\n\nMessage received from", key, "---MESSAGE---:", message)
        await chatBalancer({
            **message,
            "key" : key
        })
        print(f"< {message}")
    
    elif message.get("type") == "sessions":
        print("closing last 5 existing sessions for", message["sessions"][-1])
        for key in message["sessions"][-6:-1]:
            
            #closing the conection
            try:
                await sessions[key]["websocket"].close()
                
                print(key, "successfully closed")
            except:
                print(key, "already closed")

            #sending a message and clearing the room
            finally:
                try:
                    for chat_id in chat_ids:
                        try:
                            await bots_list[sessions[key]["room"]].bot.send_message(chat_id=chat_id, text="client disconected")
                        except:
                            pass
                    room = sessions[key]["room"]
                    bots_list[room].isBusy = False
                except:
                    print(key, "was never assigned to a room")
            
            #removing session from sessions list
            try:
                del sessions[key]
            except:
                pass



start_chat = websockets.serve(register, port = PORT)

asyncio.get_event_loop().run_until_complete(start_chat)
asyncio.get_event_loop().run_forever()
