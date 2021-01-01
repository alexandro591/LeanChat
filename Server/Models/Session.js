module.exports = Session = class{
    constructor(visitor, operator = null, room){
        this.visitor = visitor,
        this.operator = operator,
        this.room = room
    }
}