const app = require("express")();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})
require('dotenv').config();

// if (process.env.NODE_ENV === 'production') {
//     // Exprees will serve up production assets
//     app.use(express.static('client/build'));

//     // Express serve up index.html file if it doesn't recognize route
//     const path = require('path');
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }

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
                console.log(socket.id + " joined room " + roomId);
                io.in(roomId).emit("start-game", roomId);
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
        const sockets = Array.from(io.of("/").adapter.rooms.get(temp)).map(socket => socket);
        console.log("sockets: "+sockets);

        io.in(temp).emit("final-room", roomId);
    });

    socket.on("update", ({turn, roomId, socketId, position, tempId, tempBoxColor})=>{
        socket.to(roomId).emit("updated", {turn, position, tempId, tempBoxColor});
    })
    socket.on("send-message", ({roomId, tempMessage, playerRole}) => {
        io.in(roomId).emit("receive-message", tempMessage, playerRole);
    })
    socket.on("game-leave-check", ({playerRole, roomId})=>{
        var rooms = io.of("/").adapter.rooms;
        const roomSockets = rooms.get(roomId);
        if(roomSockets!=undefined){
            const numClients = roomSockets.size;
            // console.log(numClients);
            if(numClients<2){
                // const tempWinner = [...roomSockets][0];
                const winner = playerRole==1?"red":"blue";
                io.in(roomId).emit("game-left", {winner});
            }
        }
    })
})

server.listen(process.env.PORT || 4000, ()=>{
    console.log("server on");
})

