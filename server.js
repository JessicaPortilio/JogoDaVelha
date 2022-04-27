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

    socket.on("game.begin", function(data){
        const game = join(socket, data)
        if(game.player2){
            console.log("Novo Jogo começando.", game);
            clients[game.player1.socketId].emit("game.begin", game);
            clients[game.player2.socketId].emit("game.begin", game);
        }
    });

    socket.on("disconnect", function () {
        console.log("Cliente desconectado. ID => " + id);
        delete clients[id];
    });
});

const join = (socket, data) => {
    const player = new Player(data.playerName, 'X', socket.id);
    if(unmatched){
        unmatched.player2 = player;
        games[unmatched.player1.socketId] = unmatched;
        games[unmatched.player2.socketId] = unmatched;
        unmatched = null;
        return games[socket.id];
    }else {
        unmatched = new Game(player);
        return unmatched;
    }
}