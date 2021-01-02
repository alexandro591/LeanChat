module.exports = Room = class{
    constructor(name, telegramBot, isBusy = false, visitor = null, operator = null, websocket = null){
        this.name = name
        this.telegramBot = telegramBot
        this.isBusy = isBusy
        this.operator = operator
        this.visitor = visitor
        this.websocket = websocket
    }

    sendMessageToOperator = async (message) => {
        await this.telegramBot.sendMessage(this.operator.chat_id, message, {parse_mode : "HTML"})
        .catch(() => {})
    }

    sendBroadcastToOperators = async (message, operators) => {
        await Promise.all(
            operators.map(operator => {
                return this.telegramBot.sendMessage(operator.chat_id, message, {parse_mode : "HTML"})
                .catch(() => {})
            })
        )
    }

    sendMessage = async (message, operators = null) => {
        if(this.operator){
            await this.sendMessageToOperator(message)
        }
        else{
            await this.sendBroadcastToOperators(message, operators)
        }
    }
    cleanRoom = () => {
        this.visitor = null
        this.operator = null
        this.isBusy = null
        this.websocket = null
    }
}