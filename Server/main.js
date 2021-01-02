const environment  = require("../environment")
const ports = environment.ports

//npm packages
const WebSocket = require('ws');
const uuidv4 = require('uuid').v4;

//utils
const getKey = require('./Utils/getKey')

//functions
const {operators, rooms} = require('./Functions/shared')

//models
const Session = require('./Models/Session')
const Visitor = require('./Models/Visitor')

const sessions = {}

const WebSocketServer = new WebSocket.Server({port: ports.server});

const interval = setInterval( () => {
    let total = 0
    const sessionKeys = []
    WebSocketServer.clients.forEach( async ws => {
        sessionKeys.push(ws.sessionKey)
        total ++
    });
    for(let sessionKey in sessions){
        if(!sessionKeys.includes(sessionKey)){
            sessions[sessionKey].room.sendBroadcastToOperators("<b><i>--- El cliente se ha desconectado. ---</i></b>", operators)
            sessions[sessionKey].room.cleanRoom()
            delete sessions[sessionKey]
        }
    }
    // console.log(total, "clientes conectados")
}, 3000);
  
WebSocketServer.on('close', () => {
    clearInterval(interval);
});


WebSocketServer.on('connection', (ws, request) => {
    ws.sessionKey = getKey(request)

    ws.on('message', async message => {
        const messageObject = JSON.parse(message)
        console.log(messageObject)
        const sessionKey = getKey(request)

        if(messageObject.type === "register" && !messageObject.uuidv4){
            const _uuidv4 = uuidv4()
            const registrationMessage = {
                type : "register",
                message : "registered successfully",
                sessionKey,
                uuidv4 : _uuidv4
            }
            ws.send(JSON.stringify(registrationMessage));
            console.log("New visitor registered with key:", sessionKey, "and uuidv4:", _uuidv4)
        }
        else if(messageObject.type === "register"){
            console.log(`Visitor ${messageObject.uuidv4} has connected`)
        }
        else if(messageObject.type === "message"){
            if(!sessions[sessionKey]){
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
                        rooms[i].websocket = ws

                        await rooms[i].sendMessage("<b><i>--- " + visitor.name + " se ha conectado." + " ---</i></b>", operators)
                        await rooms[i].sendMessage(messageObject.message, operators)

                        sessions[sessionKey] =  new Session((new Date()).toUTCString(), rooms[i])
                        
                        break;
                    }
                }
            }
            else{
                sessions[sessionKey].room.sendMessage(messageObject.message, operators)
            }
        }
        
    });
    
    const sessionKey = getKey(request)
    console.log(`New conection from: ${sessionKey}`)
    const firstMessage = {
        type : "first",
        message : "conection successfull",
        sessionKey,
    }
    ws.send(JSON.stringify(firstMessage));
});