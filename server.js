import http from 'http'
// atráves do http express que vou criar o server 
// e vou conseguir conectar o express e o socket na mesma porta
import express from 'express'
import socketIo from "socket.io";
import ejs from 'ejs'


const app = express()
const server = http.Server(app).listen(8080)
const io = socketIo(server);
const clients = {};

//aqui estamos fazendo todo o mapeamento
app.use(express.static('./public'))
app.use('/vendor', express.static('./node_modules'))

app.set("views", "./public")
app.set("view engine", "html")
app.engine("html", ejs.renderFile)

// Rota
app.get("/", (req, res) => {
    return res.render("index.html")
});

// tratar a requisição do socket dentro do navegador
io.on("connection", (socket) => {
    let id = socket.id
    console.log("Novo cliente conectado. ID => " + id);
    clients[id] = socket

    socket.on("disconnect", function () {
        console.log("Cliente desconectado. ID => " + id);
        delete clients[id];
    });
});