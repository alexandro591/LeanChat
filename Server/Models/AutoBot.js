module.exports = class AutoBot{
    constructor(name, enabled){
        this.name = name
        this.enabled = enabled
    }

    talk = (message) => {
        if(message.toLowerCase().includes("hola")){
            return `Hola, ¿cómo estás?`
        }
        else{
            return "Lo siento, no entendí."
        }
    }

    greet = () => {
        return `Hola, soy ${this.name} 🤖 y estoy aquí para ayudarte mientras un operador se conecta. 😁`
    }

}