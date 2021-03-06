import Board from "./Board.js";
class Game {
    constructor(player1){
        this._player1 = player1;
        this._player2 = null;
        this._board = new Board();
        this._gameOver = null;
        // ganhador
        this._winner = null;
        // de quem é a vez de começar
        this._turnOf = "X";
        this.qtdWinner1 = 0;
        this.qtdWinner2 = 0;
    }

    get player1(){
        return this._player1;
    }

    get player2(){
        return this._player2;
    }

    set player2(player2){
        // Inicializar o player2 com O
        player2.symbol = "O";
        this._player2 = player2;
    }

    get board(){
        return this._board;
    }

    get gameOver(){
        return this._gameOver;
    }

    checkGameOver() {
        const {gameOver, winner} = this._board.isGameOver();
        this._gameOver = gameOver;
        this._winner = winner;
        
        // incrementa o placar
        if(this._winner == "X")
            this.qtdWinner1++
        if(this._winner == "O")
            this.qtdWinner2++
    }

    // Quando precisar mudar o turno X ou O
    changeTurn() {
        this._turnOf = this._turnOf == "X" ? "O" : "X";
    }
}

export default Game;