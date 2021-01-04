module.exports = class Room{
    constructor(name, telegramBot, isBusy = false, visitor = null, operator = null, websockets = null){
        this.name = name
        this.telegramBot = telegramBot
        this.isBusy = isBusy
        this.operator = operator
        this.visitor = visitor
        this.websockets = websockets
    }

    sendMessageToOperator = async (messageObject, log = true) => {
        await this.telegramBot.sendMessage(this.operator.chat_id, messageObject.message, {parse_mode : "HTML"})
        .catch(() => {})
        if(log){
            console.log(">>>", messageObject)
        }
    }

    sendBroadcastToOperators = async (messageObject, operators, log = true) => {
        await Promise.all(
            operators.map(operator => {
                return this.telegramBot.sendMessage(operator.chat_id, messageObject.message, {parse_mode : "HTML"})
                .catch(() => {})
            })
        )
        if(log){
            console.log(">>>", messageObject)
        }
    }

    sendMessageFromClient = async (messageObject, operators = null, log = true) => {
        if(this.operator){
            await this.sendMessageToOperator(messageObject, log)
        }
        else{
            await this.sendBroadcastToOperators(messageObject, operators, log)
        }
    }
    sendMessageToClient = (messageObject, log = true) => {
        this.websockets.forEach(websocket => {
            websocket.send(JSON.stringify(messageObject))
        })
        if(log){
            console.log("<<<", messageObject)
        }
    }
    cleanRoom = () => {
        this.visitor = null
        this.operator = null
        this.isBusy = null
        this.websocket = null
    }
}