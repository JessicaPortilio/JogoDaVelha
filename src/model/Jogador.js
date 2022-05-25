class Jogador {
    constructor(nome, simbolo, socketId, codigo){
        this._nome = nome;
        this._simbolo = simbolo;
        this._socketId = socketId;
        this._codigo = codigo;
    }

    get nome() {
        return this._nome;
    }

    get simbolo() {
        return this._simbolo;
    }

    // trocar o simbolo 
    set simbolo(simbolo){
        return this._simbolo = simbolo;
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

export default Jogador;