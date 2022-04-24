class Player {
    constructor(name, symbol, socketId){
        this._name = name;
        this._symbol = symbol;
        this._socketId = socketId;
    }

    get name() {
        return this._name;
    }

    get symbol() {
        return this._symbol;
    }

    // trocar o simbolo 
    set symbol(symbol){
        return this._symbol = symbol;
    }

    get socketId() {
        return this._socketId;
    }
}

export default Player