const app = new Vue({
    el: "#app",
    data: {
        socket: null,
        game: null,
        myTurn: null,
        symbol: null,
        playerName: null,
        message: "",
        blockRegister: false,
        classCode: null,
        cod: null,
    },
    methods: {
        startGame(codigo) {
            console.log("Entrei no start game")
            console.log("codigo: ", codigo)
            if(codigo == undefined) {
                // procedimento de jogo normal, players jogam aleatoriamente entre si
                this.message = "Aguardando adversario...";
                this.blockRegister = true;
                console.log("imprimindo o codigo: ", codigo)
                // this.socket.emit("game.begin", {
                //     playerName: this.playerName,
                //     codigo: codigo,
                // });
                this.socket.emit("game.begin", this.playerName, codigo);
            }
            else {
                // if(codigo == this.classCode) {
                if(codigo != undefined) {
                    // entrar em uma sala privada com o codigo
                    this.blockRegister = true;
                    this.socket.emit("game.begin", {
                        playerName: this.playerName,
                        // verificar como vai ficar o nome do segundo jogador
                    });
                }
            }

            
        },

        createClassGame() {
          // gerar número aleatorio para a sala
          this.classCode = Math.floor(Math.random() * 1001);
          // colocar o número da sala
          // aguardar jogador que digite o codigo 
          this.message = "Aguardando adversario..."; 
          // chamar o startGame
          this.startGame(this.classCode)
        },

        renderTurnMessage() {
            this.message = this.myTurn ? "Sua vez de jogar" : "Aguarde a vez do adversário";
        },

        makeMove(cell) {
            if (!this.myTurn || cell.symbol !== null) return; // não é a vez do jogador ou já contém simbolo
            this.socket.emit("make.move", {
                symbol: this.symbol,
                position: this.game._board._cells.indexOf(cell),
            });
        },

        resetGame() {
            this.socket.emit("game.reset")
        },
    },
    mounted() {
        this.socket = io.connect(window.location.origin);

        const self = this;

        this.socket.on("game.begin", function (data) {
            self.game = data;
            const myPlayer = data._player1._socketId == self.socket.id
                ? data._player1
                : data._player2;

            self.symbol = myPlayer._symbol;
            self.myTurn = data._turnOf == self.symbol;
            self.renderTurnMessage();
        });

        this.socket.on("move.made", (data) => {
            self.game = data;
            self.myTurn = data._turnOf == self.symbol; // verifica de quem é a vez
            self.renderTurnMessage(); // checa qual mensagem deve aparecer na tela
        });

        this.socket.on("gameover", function (data) {
            self.game = data;
            self.myTurn = false;

            if (self.game._winner) {
                self.message =
                    self.game._winner == self.symbol ? "VOCÊ GANHOU!!!" : "Você perdeu...";
                    // self.game._winner == self.symbol ? self.qtdWinner1 = self.qtdWinner1++ : self.qtdWinner2 = self.qtdWinner2++
            } else {
                self.message = "Jogo empatado";
            }
        });

        this.socket.on("opponent.left", function () {
            self.game = null
            self.blockRegister = false
            self.message = "Seu adversário saiu do jogo";
        });
    },
});







