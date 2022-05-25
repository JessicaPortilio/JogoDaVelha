import Tabuleiro from "./Tabuleiro.js";
class Jogo {
    constructor(jogador1){
        this._jogador1 = jogador1;
        this._jogador2 = null;
        this._tabuleiro = new Tabuleiro();
        this._jogoAcabou = null;
        // ganhador
        this._ganhador = null;
        // de quem é a vez de começar
        this._vezDe = "X";
        this.qtdGanhador1 = 0;
        this.qtdGanhador2 = 0;
    }

    get jogador1(){
        return this._jogador1;
    }

    get jogador2(){
        return this._jogador2;
    }

    set jogador2(jogador2){
        // Inicializar o jogador2 com O
        jogador2.simbolo = "O";
        this._jogador2 = jogador2;
    }

    get tabuleiro(){
        return this._tabuleiro;
    }

    get jogoAcabou(){
        return this._jogoAcabou;
    }

    checkJogoAcabou() {
        const {jogoAcabou, ganhador} = this._tabuleiro.isJogoAcabou();
        this._jogoAcabou = jogoAcabou;
        this._ganhador = ganhador;
        
        // incrementa o placar
        if(this._ganhador == "X")
            this.qtdGanhador1++
        if(this._ganhador == "O")
            this.qtdGanhador2++
    }

    // Quando precisar mudar o turno X ou O
    mudarVez() {
        this._vezDe = this._vezDe == "X" ? "O" : "X";
    }
}

export default Jogo;