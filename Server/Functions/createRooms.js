process.env.NTBA_FIX_319 = 1

const environment  = require("../../Environment/environment")
const bots = environment.bots

const TelegramBot = require('node-telegram-bot-api')

const Room = require('../Models/Room')

const operators = require('../Functions/createOperators')

const rooms = []

bots.forEach(bot => {
    const token = bot.token
    const _room = new Room(
        room = bot.room,
        telegramBot = new TelegramBot(token, {polling: true}),
    )

    _room.telegramBot.on('message', async (msg) => {
        const chat_id = msg.chat.id
        if(msg.text === "/getChatId"){
            _room.telegramBot.sendMessageFromClient(chatId, 'Your chat id is: ' + chat_id)
        }
        else{
            let operator
            const date = (new Date()).toUTCString()
            for(let i in operators){
                if(operators[i].chat_id === chat_id){
                    operator = operators[i]
                    break
                }
            }
            if(_room.isBusy && !_room.operator){
                await _room.sendMessageToClient({
                    type : "message",
                    message : ` ${operator.name} se ha conectado.`,
                    date
                })
                await _room.sendMessageFromClient(`<b>El operador ${operator.name} se ha conectado.</b>`, operators)

                await _room.sendMessageToClient({
                    type : "message",
                    message : msg.text,
                    date
                })
                _room.operator = operator
            }
            else if(_room.isBusy){
                if(_room.operator.chat_id === chat_id){
                    await _room.sendMessageToClient({
                        type : "message",
                        message : msg.text,
                        date
                    })
                }
            }
        }
    })

    rooms.push(_room)
})

module.exports = rooms