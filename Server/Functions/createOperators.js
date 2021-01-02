const environment  = require("../../environment")
const chat_ids = environment.chat_ids

const Operator = require('../Models/Operator')

const operators = []

chat_ids.forEach(chat_id => {
    operator = new Operator(chat_id.name, chat_id.chat_id)
    operators.push(operator)
})

module.exports = operators