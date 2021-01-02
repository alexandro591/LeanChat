module.exports = Session = class{
    constructor(date, room){
        this.date = date
        this.room = room
    }

    websockets = this.room?.websockets

    sendMessageToOperator = this.room?.sendMessageToOperator
    sendBroadcastToOperators = this.room?.sendBroadcastToOperators
    sendMessageFromClient = this.room?.sendMessageFromClient
    sendMessageToClient = this.room?.sendMessageToClient
    cleanRoom = this.room?.cleanRoom
}