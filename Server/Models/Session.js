module.exports = class Session{
    constructor(date, room){
        this.date = date
        this.room = room
    }

    websockets = () => {
        return this.room.websockets
    }

    // sendMessageToOperator = () => {
    //     return this.room.sendMessageToOperator
    // }
    // sendBroadcastToOperators = () => {
    //     return this.room.sendBroadcastToOperators
    // } 
    // sendMessageFromClient = () => {
    //     return this.room.sendMessageFromClient
    // }
    // sendMessageToClient = () => {
    //     return this.room.sendMessageToClient
    // }
    // cleanRoom = () => {
    //     return this.room.cleanRoom
    // }
}