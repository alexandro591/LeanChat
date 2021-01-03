const environment  = require("../Environment/environment")
const ports = environment.ports
const autoBotConfig = environment.autoBot

//npm packages
const WebSocket = require('ws')
const uuidv4 = require('uuid').v4

//utils
const {removeItemAll} = require('./Utils/removeFromArray')
const getKey = require('./Utils/getKey')

//functions
const {operators, rooms} = require('./Functions/shared')
const heartBeat = require('./Functions/heartBeat')

//models
const Session = require('./Models/Session')
const Visitor = require('./Models/Visitor')
const AutoBot = require('./Models/AutoBot')

const autoBot = new AutoBot(autoBotConfig.name, autoBotConfig.enabled)

const sessions = {}

const WebSocketServer = new WebSocket.Server({port: ports.server})

const interval = setInterval( () => {
    let total = 0
    const _sessions = []
    WebSocketServer.clients.forEach( async ws => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
        _sessions.push(ws)
        total ++
    })
    for(let uuidv4 in sessions){
        sessions[uuidv4].websockets().forEach(ws => {
            if(!_sessions.includes(ws)){
                removeItemAll(sessions[uuidv4].websockets(), ws)
            }
        })
        if(sessions[uuidv4].websockets().length === 0){
            sessions[uuidv4].room.sendBroadcastToOperators({
                type : "botMessage",
                message  : "<b><i>--- El cliente se ha desconectado. ---</i></b>",
                uuidv4 : uuidv4
            }, operators)
            sessions[uuidv4].room.cleanRoom()
            delete sessions[uuidv4]
        }
    }
}, 1000)
  
WebSocketServer.on('close', () => {
    clearInterval(interval)
})


WebSocketServer.on('connection', (ws, request) => {
    ws.isAlive = true
    ws.sessionKey = getKey(request)
    ws.on("pong", heartBeat)
    ws.on('message', async message => {
        const date = (new Date()).toUTCString()
        const messageObject = JSON.parse(message)
        messageObject.date = date
        messageObject.sessionKey = ws.sessionKey

        if(messageObject.type !== "register" || messageObject.type === "visitor"){
            console.log(">>>", messageObject)
        }

        if(messageObject.type === "register"){
            const registrationMessage = {
                type : "register",
                message : "registered successfully",
                uuidv4 : messageObject.uuidv4,
                date : date
            }
            ws.send(JSON.stringify(registrationMessage))
            console.log("<<<", registrationMessage)
        }
        else if(messageObject.type === "visitorMessage"){
            if(!sessions[messageObject.uuidv4]){
                for(let i in rooms){
                    if(!rooms[i].isBusy){
                        const visitor = new Visitor(
                            messageObject.name,
                            messageObject.first_name,
                            messageObject.last_name,
                            messageObject.uuidv4,
                            messageObject.email,
                            messageObject.phone
                        )
                        rooms[i].isBusy = true
                        rooms[i].visitor = visitor
                        rooms[i].websockets = [ws]

                        await rooms[i].sendMessageFromClient({
                            type : "botMessage",
                            message : "<b><i>--- " + visitor.name + " se ha conectado." + " ---</i></b>",
                            uuidv4 : messageObject.uuidv4,
                            date
                        }, operators)
                        await rooms[i].sendMessageFromClient(messageObject, operators)

                        sessions[messageObject.uuidv4] =  new Session(date, rooms[i])
                        if(autoBot.enabled){
                            sessions[messageObject.uuidv4].room.sendMessageToClient({
                                type : "botMessage",
                                message : autoBot.greet(),
                                uuidv4 : messageObject.uuidv4,
                                date
                            })
                        }
                        break
                    }
                }
            }
            else{
                sessions[messageObject.uuidv4].room.sendMessageFromClient(messageObject, operators)
                if(!sessions[messageObject.uuidv4].websockets().includes(ws)){
                    sessions[messageObject.uuidv4].websockets().push(ws)
                }
                if(autoBot.enabled && !sessions[messageObject.uuidv4].room.operator){
                    sessions[messageObject.uuidv4].room.sendMessageToClient({
                        type : "botMessage",
                        message : autoBot.talk(messageObject.message),
                        uuidv4 : messageObject.uuidv4,
                        date : (new Date().toUTCString())
                    })
                }
            }
        }
    })

    const date = (new Date()).toUTCString()
    const _uuidv4 = uuidv4()
    const firstMessage = {
        type : "first",
        message : "conection successfull",
        uuidv4 : _uuidv4,
        sessionKey : ws.sessionKey,
        date
    }

    ws.send(JSON.stringify(firstMessage))
    console.log("<<<", firstMessage)

})