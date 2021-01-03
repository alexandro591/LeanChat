const removeAccents = require('../Utils/removeAccents')

module.exports = class AutoBot{
    constructor(name, enabled){
        this.name = name
        this.enabled = enabled
    }

    talk = (message) => {
        message = removeAccents(message.toLowerCase())
        if(
            message.includes("localizacion") ||
            message.includes("se ubican") ||
            message.includes("estan ubicados")  ||
            message.includes("google maps") ||
        )
            return "Claro, puedo decir con certeza que nos ubicamos en https://www.google.com"
        if(
            message.includes("hola")
        )
            return "Hola, ¿Cómo estás?... 😀"
        return "Lo siento, no entendi"
        
    }

    greet = () => {
        return `Hola, soy ${this.name} 🤖 y estoy aquí para ayudarte mientras un operador se conecta. 😁`
    }

}