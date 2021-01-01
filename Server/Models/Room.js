module.exports = Room = class{
    constructor(name, telegramBot, isBusy = false, visitor = null, operator = null, websocket = null){
        this.name = name
        this.telegramBot = telegramBot
        this.isBusy = isBusy
        this.operator = operator
        this.visitor = visitor
        this.websocket = websocket
    }

    sendMessageToOperator = (message) => {
        this.telegramBot.sendMessage(this.operator.chat_id, message)
        .catch(() => {})
    }

    sendBroadcastToOperators = (message, operators) => {
        operators.forEach(operator => {
            this.telegramBot.sendMessage(operator.chat_id, message)
            .catch(() => {})
        });
    }

    sendMessage = (message, operators = null) => {
        if(this.operator){
            this.sendMessageToOperator(message)
        }
        else{
            this.sendBroadcastToOperators(message, operators)
        }
    }
}