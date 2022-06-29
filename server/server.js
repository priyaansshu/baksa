const app = require("express")();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", socket =>{
    socket.join(socket.id);
    socket.on("joined-room", (roomId)=>{
        var room = io.of("/").adapter.rooms.get(roomId);
        console.log(room.size);
        if(room.size > 1){
            console.log("room is full");
        }
        else{
            socket.join(roomId);
            console.log(socket.id + " joined room " + roomId);
            io.in(roomId).emit("start-game");
        }
    })
    socket.on("turn", (turn, roomId)=>{
        io.in(roomId).emit("set-turn");
    })
})

server.listen(4000, ()=>{
    console.log("server running");
})

