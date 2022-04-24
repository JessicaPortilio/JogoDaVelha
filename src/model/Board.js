class Board {
    // ele vai controlar as 9 posições do jogo no tabuleiro
    constructor(){
        this._cells = [
            // pra cada posição, vai poder armazenar um símbolo
            {Symbol: null },
            {Symbol: null },
            {Symbol: null },

            {Symbol: null },
            {Symbol: null },
            {Symbol: null },

            {Symbol: null },
            {Symbol: null },
            {Symbol: null },
        ]
    }
    getCell(index){
        return this._cells[index];
    }

    setCell(index, symbol){
        this._cells[index].symbol = symbol;
    }

    get cells () {
        return this._cells;
    }

    reset() {
        // pegar todas as posições e fazer um for pra zerar o tabuleiro
        this._cells.forEach((cell) => (cell.symbol = null));

    }
}

export default Board