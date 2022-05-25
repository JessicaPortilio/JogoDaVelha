import http from 'http'
// atráves do http express que vou criar o server 
// e vou conseguir conectar o express e o socket na mesma porta
import express from 'express';
import socketIo from 'socket.io';
import ejs from 'ejs';
import Player from "./src/model/Player.js";
import Game from "./src/model/Game.js";

const app = express();
const server = http.Server(app).listen(8080);
const io = socketIo(server);
const clients = {};

//aqui estamos fazendo todo o mapeamento
app.use(express.static('./public'));
app.use('/vendor', express.static('./node_modules'));

app.set("views", "./public");
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// Rota
app.get("/", (req, res) => {
    return res.render("index.html");
});

const games = {};
let unmatchedPrivate = null;
let unmatchedPublic = null;
// tratar a requisição do socket dentro do navegador
io.on("connection", (socket) => {
    let id = socket.id
    clients[id] = socket;

    socket.on("game.begin", function(data){ // trata o match entre dois jogadores verificando se os mesmos já conectaram simultaneamente
        
        const game = join(socket, data)
        if(game.player2){
            // verifica se o jogador digitou um número de sala (válido)

            // começa o jogo aleatoriamente
            clients[game.player1.socketId].emit("game.begin", game);
            clients[game.player2.socketId].emit("game.begin", game);
        }
    });

    socket.on("make.move", function(data){
        const game = games[socket.id];
        game._board.setCell(data.position, data.symbol);
        game.checkGameOver();
        game.changeTurn();
         
        const event = game.gameOver ? "gameover" : "move.made"; // muda a vez do jogador e depois recebe o game over
        clients[game.player1.socketId].emit(event, game);
        clients[game.player2.socketId].emit(event, game);
    });

    socket.on("game.reset", function(data){
        const game = games[socket.id]
        if(!game) return
        game.board.reset()
        clients[game.player1.socketId].emit("game.begin", game);
        clients[game.player2.socketId].emit("game.begin", game);
    })

    socket.on("disconnect", function () { //verifica se o jogador saiu e o deleta 
        const game = games[socket.id];
        if(game) { 
            const socketEmit = game.player1.socketId == socket.id 
                ? clients[game.player2.socketId]
                : clients[game.player1.socketId];

            if(socketEmit) {
                socketEmit.emit("opponent.left");
            }

            delete games[socket.id]
            delete games[socketEmit.id]
        }
        delete clients[id];
    });
});

const join = (socket, data) => { // trata a comunicação entre os dois clients enviando que ambos estão conectados
    // PUBLIC GAME
    if(data.codigo == undefined) {
        
        const player = new Player(data.playerName, "X", socket.id, data.codigo);
        
        if(unmatchedPublic){ // cria o player2
            unmatchedPublic.player2 = player;
            games[unmatchedPublic.player1.socketId] = unmatchedPublic;
            games[unmatchedPublic.player2.socketId] = unmatchedPublic;
            unmatchedPublic = null;
            return games[socket.id];
        }else { // cria o player1
            unmatchedPublic = new Game(player);
            return unmatchedPublic;
        }
    }
    // PRIVATE GAME
    else { // entro apenas quando tenho um código digitado
        // talvez fazer uma validação de codigo

        const player = new Player(data.playerName, "X", socket.id, data.codigo);

        if(unmatchedPrivate){ // cria o player2
            // if(unmatchedPrivate.player1.codigo == data.codigo) {
                unmatchedPrivate.player2 = player;
                games[unmatchedPrivate.player1.socketId] = unmatchedPrivate;
                games[unmatchedPrivate.player2.socketId] = unmatchedPrivate;
                unmatchedPrivate = null;
                return games[socket.id];
            // }
            // else { 
                // caso onde o codigo está errado e o player digita dnv, chamando a primeira tela

                // caso onde o player quer criar uma nova sala (se o codSala não foi digitado mas gerado aleatoriamente)
            //     if(data.novo) {
            //         unmatchedPrivate = new Game(player);
            //         return unmatchedPrivate;
            //     }
            // }
            
        }else { // cria o player1
            unmatchedPrivate = new Game(player);
            return unmatchedPrivate;
        }
    }
}