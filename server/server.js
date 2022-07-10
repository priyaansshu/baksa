const app = require("express")();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", socket =>{
    socket.join(socket.id);
    socket.on("room-created", (roomId)=>{
        var room = io.of("/").adapter.rooms.get(roomId);
        // console.log(room.size);
    })
    socket.on("joined-room", (roomId)=>{
        var room = io.of("/").adapter.rooms.get(roomId);
        // console.log(room.size);
        if(room.size > 1){
            console.log("room is full");
            socket.emit("room-full");
        }
        else{
            // console.log(room.size);
            socket.join(roomId);
            console.log(socket.id + " joined room " + roomId);
            io.in(roomId).emit("start-game");
        }
    })
    socket.on("update", ({turn, roomId, position, tempId, tempBoxColor})=>{
        // console.log("roomId: ", roomId);
        // console.log(elMap);
        socket.broadcast.emit("updated", {turn, position, tempId, tempBoxColor});
    })
})

server.listen(4000, ()=>{
    console.log("server on");
})

