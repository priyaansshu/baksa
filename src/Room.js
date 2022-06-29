import React, {useState} from 'react';
import "./style.css"
// import {io} from "socket.io-client"
import Game from "./Game"

// const socket = io('http://localhost:4000');

export default function (props) {
    const [roomId, setRoomId] = useState("");
    const [shared, setShared] = useState(false);
    const [joined, setJoined] = useState(false)
    
    // socket.on("start-game", ()=>{
    //     setJoined(true);
    // })
        return (
            <>
        {joined?
            <Game gridSize={props.gridSize} roomId={roomId}/>:
        !shared?<div className="rooms-main-container">
            <div className="create-room-container">
                <button className="create-room" onClick={()=>{window.alert("Room ID copied to clipboard."); setShared(true); 
                // navigator.clipboard.writeText(socket.id)
            }}
                ></button>
            </div>
            <div className="join-room-container">
                <input className="room-input" type="text" onChange={(e)=>{
                    setRoomId(e.target.value);
                }}/>
                <button className="join-room"   
                    // onClick={()=>{
                    //     socket.emit("joined-room", roomId)
                    // }}
                >
                Join
                </button>
            </div>
            <p className="room-id-statement">Share Room ID with a friend or enter a Room ID to start the game</p>
        </div>:
        <div className="rooms-main-container waiting-room-container">
            <div className="waiting-icon-container">

            </div>
            <p className="room-id-statement">Waiting for the other player to join the room</p>
        </div>}
    </>
  )
}
