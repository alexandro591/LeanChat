process.env.NTBA_FIX_319 = 1;

const environment  = require(__dirname + "/../environment.json")
const TelegramBot = require('node-telegram-bot-api')
const WebSocketClient = require('websocket').client;
const bots = []

for(let room in environment.bots){
    const token = environment.bots[room].token;
    bots.push(new TelegramBot(token, {polling: true}));
}

bots.forEach(bot => {
    bot.on('message', async (msg) => {
        let room
        for(let _room in environment.bots){
            if(environment.bots[_room].token === bot.token){
                room = _room
            }
        }
        const chatId = msg.chat.id;
        if(msg.text === "/getChatId"){
            bot.sendMessage(chatId, 'Your chat id is: ' + msg.chat.id);
        }
        else{
            if(environment.chat_ids.includes(msg.from.id)){
                const client = new WebSocketClient();
                client.connect('ws://127.0.0.1:9000/ws');
                
                client.on('connect', async (connection) => {
                    connection.send(JSON.stringify({
                        "message" : msg.text,
                        "chat_id" : msg.from.id,
                        "room" : room,
                        "type" : "message"
                    }))
                    // await connection.close()
                });
            }
        }
    });
});
