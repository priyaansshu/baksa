import React, {useEffect, useState, useRef} from 'react';
import "./style.css"
import {io} from "socket.io-client"
import Game from "./Game"
import Header from './Components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Link, Routes} from "react-router-dom";

const socket = io('http://localhost:4000');

export default function (props) {
    const [roomId, setRoomId] = useState("");
    const [shared, setShared] = useState(false);
    const [joined, setJoined] = useState(false)
    const [roomFull, setRoomFull] = useState(false);
    const [playerRole, setPlayerRole] = useState(); // playerRole=1 if he created the room, else 2 if he joined one
    const [roomCode, setRoomCode] = useState();
    const [roomDoesNotExist, setRoomDoesNotExist] = useState(false);
    
    socket.on("start-game", ()=>{
        if(playerRole==1)toast.dismiss(roomCopiedToastId.current);
        setJoined(true);
    })
    socket.off("room-full").on("room-full", ()=>{
        toast("Room is full", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        console.log("room is full")
    })
    socket.off('room-does-not-exist').on("room-does-not-exist", ()=>{
        setRoomDoesNotExist(true);
    })

    useEffect(()=>{ 
        if(roomDoesNotExist){
            console.log("here");
            toast("Room does not exist", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            console.log("Room does not exist");
            setRoomDoesNotExist(false);
        }
    }, [roomDoesNotExist])

    const roomCopiedToastId = useRef(null);
    function idCopied (){
        if(roomCopiedToastId!=null){
            toast.dismiss(roomCopiedToastId.current);
        }
        roomCopiedToastId.current = toast("Room ID copied to clipboard", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            // transition: "zoom"
        });  
    } 

    const generateRandomString = (myLength) => {
        const chars =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomArray = Array.from(
          { length: myLength },
          (v, k) => chars[Math.floor(Math.random() * chars.length)]
        );
      
        const randomString = randomArray.join("");
        return randomString;
      };

    return (
        <>
            {joined?
            // <Route exact path={"/"+playerRole==1?roomCode:roomId} element={
                <Game gridSize={props.gridSize} roomId={playerRole==1?roomCode:roomId} socketId={socket.id} playerRole={playerRole}/>
            // }/>
            :
            // <Route exact path={"/"} element={
            <div>
                <Header gridSize={props.gridSize}/>
                {!shared?
                <div className="rooms-main-container">
                    <div className="create-room-container">
                        <button 
                            className="create-room" 
                            onClick={()=>{
                                idCopied();
                                setShared(true);
                                var tempRoomCode = generateRandomString(6);
                                setRoomCode(tempRoomCode);
                                // console.log(tempRoomCode);
                                socket.emit("room-created", tempRoomCode);
                                setPlayerRole(1)
                                navigator.clipboard.writeText(tempRoomCode)
                                }
                            }>    
                        </button>
                    </div>
                    <div className="join-room-container">
                        <input 
                            className="room-input" 
                            type="text" 
                            style={roomId!==""?{marginRight: "10px"}:{marginRight:"0px"}}
                            onChange={(e)=>{
                                setRoomId(e.target.value);
                            }} 
                            onKeyPress={(e)=>{
                                if(e.key==="Enter"){
                                    setPlayerRole(2)
                                    socket.emit("joined-room", roomId);
                                }
                            }}
                        />
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
                    <div className="room-id-container" onClick={()=>{
                        idCopied();
                        navigator.clipboard.writeText(roomCode);
                        }
                    }>
                        <span>{roomCode}</span>
                    </div>
                    <p className="room-id-statement">Waiting for the other player to join the room</p>
                </div>}
                <ToastContainer/>
            </div> 
            }
        </>
  )
}


        // <Route path = "/" element = {
        //     <div>
        //         <Header gridSize={props.gridSize}/>
        //         {!shared?
        //         <div className="rooms-main-container">
        //             <Link to={"/"+roomCode} style={{textDecoration: "none"}}>
        //                 <div className="create-room-container">
        //                     <button 
        //                         className="create-room" 
        //                         onClick={()=>{
        //                             idCopied();
        //                             setShared(true);
        //                             var tempRoomCode = generateRandomString(6);
        //                             setRoomCode(tempRoomCode);
        //                             // console.log(tempRoomCode);
        //                             socket.emit("room-created", tempRoomCode);
        //                             setPlayerRole(1)
        //                             navigator.clipboard.writeText(tempRoomCode)
        //                             }
        //                         }>    
        //                     </button>
        //                 </div>
        //             </Link>
        //             <Link to={"/"+roomId} style={{textDecoration: "none"}}>
        //                 <div className="join-room-container">
        //                     <input 
        //                         className="room-input" 
        //                         type="text" 
        //                         style={roomId!==""?{marginRight: "10px"}:{marginRight:"0px"}}
        //                         onChange={(e)=>{
        //                             setRoomId(e.target.value);
        //                         }} 
        //                         onKeyPress={(e)=>{
        //                             if(e.key==="Enter"){
        //                                 setPlayerRole(2)
        //                                 socket.emit("joined-room", roomId);
        //                             }
        //                         }}
        //                     />
        //                     {roomId!==""?
        //                         <button className="join-room"   
        //                             onClick={()=>{
        //                                 setPlayerRole(2);
        //                                 socket.emit("joined-room", roomId)
        //                             }}>
        //                         Join
        //                         </button>
        //                     :null
        //                     }
        //                 </div>
        //             </Link>
        //             {!roomFull?
        //                 <p className="room-id-statement">Share Room ID with a friend or enter a Room ID to start the game</p>
        //             :
        //                 <p className="room-full-statement">Room is already full</p>
        //             }
        //         </div>:
        //         <div className="rooms-main-container waiting-room-container">
        //             <div className="waiting-icon-container">
        //             </div>
        //             <div className="room-id-container" onClick={()=>{
        //                 idCopied();
        //                 navigator.clipboard.writeText(roomCode);
        //                 }
        //             }>
        //                 <span>{roomCode}</span>
        //             </div>
        //             <p className="room-id-statement">Waiting for the other player to join the room</p>
        //         </div>}
        //         <ToastContainer/>
        //     </div>}
        // />
        // <Route path = {"/"+playerRole==1?roomCode:roomId} element = {<Game gridSize={props.gridSize} roomId={playerRole==1?roomCode:roomId} socketId={socket.id} playerRole={playerRole}/>} />