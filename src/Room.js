import React, {useState} from 'react';
import "./style.css"
import {io} from "socket.io-client"
import Game from "./Game"
import Header from './Components/Header';

const socket = io('http://localhost:4000');

export default function (props) {
    const [roomId, setRoomId] = useState("");
    const [shared, setShared] = useState(false);
    const [joined, setJoined] = useState(false)
    const [roomFull, setRoomFull] = useState(false);
    const [playerRole, setPlayerRole] = useState(); // playerRole=1 if he created the room, else 2 if he joined one
    
    socket.on("start-game", ()=>{
        setJoined(true);
    })
    socket.on("room full", ()=>{
        setRoomFull(true);
        console.log(roomFull);
    })

        return (
            <>
            <Header gridSize={props.gridSize}/>
            {joined?
            <Game gridSize={props.gridSize} roomId={socket.id} playerRole={playerRole}/>:
            !shared?<div className="rooms-main-container">
            <div className="create-room-container">
                <button 
                    className="create-room" 
                    onClick={()=>{
                        // window.alert("Room ID copied to clipboard.");
                        setShared(true);
                        socket.emit("room-created", socket.id);
                        setPlayerRole(1)
                        navigator.clipboard.writeText(socket.id)
                        }
                    }>    
                </button>
            </div>
            <div className="join-room-container">
                <input className="room-input" type="text" onChange={(e)=>{
                    setRoomId(e.target.value);
                }}/>
                {roomId!==""?
                    <button className="join-room"   
                        onClick={()=>{
                            setPlayerRole(2);
                            socket.emit("joined-room", roomId)
                        }}>
                    Join
                    </button>
                :console.log("Enter Room Id")
                }
            </div>
            {!roomFull?
                <p className="room-id-statement">Share Room ID with a friend or enter a Room ID to start the game</p>
            :
                <p className="room-full-statement">Room is already full</p>
            }
        </div>:
        <div className="rooms-main-container waiting-room-container">
            <div className="waiting-icon-container">

            </div>
            <p className="room-id-statement">Waiting for the other player to join the room</p>
        </div>}
    </>
  )
}
