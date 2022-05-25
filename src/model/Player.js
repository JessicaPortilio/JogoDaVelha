class Player {
    constructor(name, symbol, socketId, codigo){
        this._name = name;
        this._symbol = symbol;
        this._socketId = socketId;
        this._codigo = codigo;
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

    get codigo() {
        return this._codigo;
    }

    // inserir o codigo
    set codigo(codigo){
        return this._codigo = codigo;
    }
}

export default Player;