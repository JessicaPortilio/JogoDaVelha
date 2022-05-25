class Tabuleiro {
    // ele vai controlar as 9 posições do jogo no tabuleiro
    constructor() {
        this._celulas = [
            // pra cada posição, vai poder armazenar um símbolo
            { simbolo: null },
            { simbolo: null },
            { simbolo: null },

            { simbolo: null },
            { simbolo: null },
            { simbolo: null },

            { simbolo: null },
            { simbolo: null },
            { simbolo: null },
        ]
    }
    getCelula(index) {
        return this._celulas[index];
    }

    setCelula(index, simbolo) {
        this._celulas[index].simbolo = simbolo;
    }

    get celulas() {
        return this._celulas;
    }

    isJogoAcabou() {
        const matches = ["XXX", "OOO"]
        const primeiroNull = this._celulas.findIndex(celula => celula.simbolo == null); // celula vazia

        const condicoesGanhar = [
            
            // linha
            this.celulas[0].simbolo + this.celulas[1].simbolo + this.celulas[2].simbolo,
            this.celulas[3].simbolo + this.celulas[4].simbolo + this.celulas[5].simbolo,
            this.celulas[6].simbolo + this.celulas[7].simbolo + this.celulas[8].simbolo,

            // coluna
            this.celulas[0].simbolo + this.celulas[3].simbolo + this.celulas[6].simbolo,
            this.celulas[1].simbolo + this.celulas[4].simbolo + this.celulas[7].simbolo,
            this.celulas[2].simbolo + this.celulas[5].simbolo + this.celulas[8].simbolo,

             // diagonal
            this.celulas[0].simbolo + this.celulas[4].simbolo + this.celulas[8].simbolo,
            this.celulas[6].simbolo + this.celulas[4].simbolo + this.celulas[2].simbolo,

        ]

        const condicaoGanhar = condicoesGanhar.find((condicao) => {
            return condicao == matches[0] || condicao == matches[1];
        });
        if ((primeiroNull) == -1 && (!condicaoGanhar)) {
            return { jogoAcabou: true, ganhador: null };
        }
        if (condicaoGanhar) {
            return {
                jogoAcabou: true,
                ganhador: condicaoGanhar == matches[0] ? 'X' : 'O',
            }

        }
            return { jogoAcabou: false, ganhador: null }; // o jogo ainda não terminou
    }

    reset() {
        // pegar todas as posições e fazer um for pra zerar o tabuleiro
        this._celulas.forEach((celula) => (celula.simbolo = null));
    }
}

export default Tabuleiro;