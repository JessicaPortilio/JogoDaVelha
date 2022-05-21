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
let unmatched = null;
// tratar a requisição do socket dentro do navegador
io.on("connection", (socket) => {
    let id = socket.id
    console.log("Novo cliente conectado. ID => " + id);
    clients[id] = socket;

    socket.on("game.begin", function(data, codigo){ //trata o match entre dois jogadores verificando se os mesmos já conectaram simultaneamente
        console.log("Estou no game.begin")
        console.log("Data: ", data)
        console.log("playerName: ", data.playerName)
        console.log("cod: ", data.cod)
        console.log("codigo: ", codigo)
        
        const game = join(socket, data)
        console.log(game.player1)
        console.log(game.player2)
        if(game.player2){
            // verifica se o jogador digitou um número de sala (válido)
            console.log("socket: ", socket)
            console.log("data: ", data)

            // começa o jogo aleatoriamente
            console.log("Novo Jogo começando.");
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

const join = (socket, data) => { //trata a comunicação entre os dois clients enviando que ambos estão conectados
    const player = new Player(data.playerName, "X", socket.id);
    if(unmatched){ // cria o player2
        unmatched.player2 = player;
        games[unmatched.player1.socketId] = unmatched;
        games[unmatched.player2.socketId] = unmatched;
        unmatched = null;
        return games[socket.id];
    }else { // cria o player1
        unmatched = new Game(player);
        return unmatched;
    }
}