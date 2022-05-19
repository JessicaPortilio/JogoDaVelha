class Board {
    // ele vai controlar as 9 posições do jogo no tabuleiro
    constructor() {
        this._cells = [
            // pra cada posição, vai poder armazenar um símbolo
            { symbol: null },
            { symbol: null },
            { symbol: null },

            { symbol: null },
            { symbol: null },
            { symbol: null },

            { symbol: null },
            { symbol: null },
            { symbol: null },
        ]
    }
    getCell(index) {
        return this._cells[index];
    }

    setCell(index, symbol) {
        this._cells[index].symbol = symbol;
    }

    get cells() {
        return this._cells;
    }

    isGameOver() {
        const matches = ["XXX", "OOO"]
        const firstNull = this._cells.findIndex(cell => cell.symbol == null); // celula vazia

        const winningConditions = [
            
            // linha
            this.cells[0].symbol + this.cells[1].symbol + this.cells[2].symbol,
            this.cells[3].symbol + this.cells[4].symbol + this.cells[5].symbol,
            this.cells[6].symbol + this.cells[7].symbol + this.cells[8].symbol,

            // coluna
            this.cells[0].symbol + this.cells[3].symbol + this.cells[6].symbol,
            this.cells[1].symbol + this.cells[4].symbol + this.cells[7].symbol,
            this.cells[2].symbol + this.cells[5].symbol + this.cells[8].symbol,

             // diagonal
            this.cells[0].symbol + this.cells[4].symbol + this.cells[8].symbol,
            this.cells[6].symbol + this.cells[4].symbol + this.cells[2].symbol,

        ]

        const winningCondition = winningConditions.find((condition) => {
            return condition == matches[0] || condition == matches[1];
        });
        if ((firstNull) == -1 && (!winningCondition)) {
            return { gameOver: true, winner: null };
        }
        if (winningCondition) {
            return {
                gameOver: true,
                winner: winningCondition == matches[0] ? 'X' : 'O',
            }

        }
            return { gameOver: false, winner: null }; // o jogo ainda não terminou
    }

    reset() {
        // pegar todas as posições e fazer um for pra zerar o tabuleiro
        this._cells.forEach((cell) => (cell.symbol = null));
    }
}

export default Board;