const environment  = require("../Environment/environment")
const ports = environment.ports
const autoBotConfig = environment.autoBot

//npm packages
const WebSocket = require('ws')
const uuidv4 = require('uuid').v4

//utils
const getKey = require('./Utils/getKey')
const {removeItemAll} = require('./Utils/removeFromArray')

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
            sessions[uuidv4].room.sendBroadcastToOperators("<b><i>--- El cliente se ha desconectado. ---</i></b>", operators)
            sessions[uuidv4].room.cleanRoom()
            delete sessions[uuidv4]
        }
    }
    console.log(total, "clientes conectados")
}, 1000)
  
WebSocketServer.on('close', () => {
    clearInterval(interval)
})


WebSocketServer.on('connection', (ws, request) => {
    ws.sessionKey = getKey(request)
    ws.isAlive = true
    ws.on("pong", heartBeat)

    ws.on('message', async message => {
        const messageObject = JSON.parse(message)
        console.log(messageObject)
        const sessionKey = getKey(request)

        if(messageObject.type === "register"){
            const registrationMessage = {
                type : "register",
                message : "registered successfully",
            }
            ws.send(JSON.stringify(registrationMessage))
            console.log("New visitor registered with key:", sessionKey, "and uuidv4:", messageObject.uuidv4)
        }
        else if(messageObject.type === "visitor"){
            console.log(`Visitor ${messageObject.uuidv4} has connected`)
        }
        else if(messageObject.type === "message"){
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

                        await rooms[i].sendMessageFromClient("<b><i>--- " + visitor.name + " se ha conectado." + " ---</i></b>", operators)
                        await rooms[i].sendMessageFromClient(messageObject.message, operators)

                        sessions[messageObject.uuidv4] =  new Session((new Date()).toUTCString(), rooms[i])
                        if(autoBot.enabled){
                            sessions[messageObject.uuidv4].room.sendMessageToClient({
                                type : "botMessage",
                                message : autoBot.greet(),
                                date : (new Date().toUTCString())
                            })
                        }
                        break
                    }
                }
            }
            else{
                sessions[messageObject.uuidv4].room.sendMessageFromClient(messageObject.message, operators)
                if(!sessions[messageObject.uuidv4].websockets().includes(ws)){
                    sessions[messageObject.uuidv4].websockets().push(ws)
                }
                if(autoBot.enabled && !sessions[messageObject.uuidv4].room.operator){
                    sessions[messageObject.uuidv4].room.sendMessageToClient({
                        type : "botMessage",
                        message : autoBot.talk(messageObject.message),
                        date : (new Date().toUTCString())
                    })
                }
            }
        }
    })
    
    const sessionKey = getKey(request)
    console.log(`New conection from: ${sessionKey}`)
    const _uuidv4 = uuidv4()
    const firstMessage = {
        type : "first",
        message : "conection successfull",
        uuidv4 : _uuidv4
    }

    ws.send(JSON.stringify(firstMessage))
})