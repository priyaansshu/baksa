const app = require("express")();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", socket =>{
    socket.io = io;
    socket.on("room-created", (roomId)=>{
        socket.join(roomId);
        console.log(socket.id + " started room " + roomId);
    })
    socket.on("joined-room", (roomId)=>{
        console.log(roomId);
        if(io.sockets.adapter.rooms.has(roomId)){
            var room = io.of("/").adapter.rooms.get(roomId);
            console.log(room.size);
            if(room.size > 1){
                console.log("room is full");
                socket.emit("room-full");
            }
            else{
                socket.join(roomId);
                // const sockets = Array.from(io.of("/").adapter.rooms.get(roomId)).map(socket => socket);
                // console.log("sockets: "+sockets);
                console.log(socket.id + " joined room " + roomId);
                io.in(roomId).emit("start-game");
            }     
        }
        else{
            socket.emit("room-does-not-exist");
        }
    })
    socket.on("rejoin", (roomId)=>{
        var temp = roomId.roomId;
        console.log(temp);
        socket.join(temp);
        // const sockets = Array.from(io.of("/").adapter.rooms.get(temp)).map(socket => socket);
        // console.log("sockets: "+sockets);

        io.in(temp).emit("final-room", roomId);
    });

    socket.on("update", ({turn, roomId, socketId, position, tempId, tempBoxColor})=>{
        // console.log(socket.nsp.name);
        // const sockets = Array.from(io.of("/").adapter.rooms.get(roomId)).map(socket => socket);
        // var partner = sockets.find(socket => socket !== socketId);
        // console.log("personal Id: "+socketId);
        // console.log("partner Id: "+partner);
        socket.to(roomId).emit("updated", {turn, position, tempId, tempBoxColor});
    })
    socket.on("test", ({roomId, socketId})=>{
        // console.log(roomId);
        const sockets = Array.from(io.of("/").adapter.rooms.get(roomId)).map(socket => socket);
        console.log(sockets);
        socket.to(roomId).emit("test", "test");
    })
    socket.on("message", ({roomId, tempMessage})=>{
        console.log(tempMessage);
        console.log(roomId);
        socket.broadcast.emit("message", tempMessage);
    })
})

server.listen(4000, ()=>{
    console.log("server on");
})

