import React, {useEffect, useState, useRef} from 'react';
import "./style.css"
import {io} from "socket.io-client"
import Game from "./Game"
import Header from './Components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Link, Routes, Navigate, useNavigate} from "react-router-dom";

const socket = io('https://baksa19.herokuapp.com/', { transports : ['websocket'] });

export default function (props) {
    const [roomId, setRoomId] = useState("");
    const [shared, setShared] = useState(false);
    const [joined, setJoined] = useState(false)
    const [roomFull, setRoomFull] = useState(false);
    const [playerRole, setPlayerRole] = useState(); // playerRole=1 if he created the room, else 2 if he joined one
    const [roomCode, setRoomCode] = useState();
    const [roomDoesNotExist, setRoomDoesNotExist] = useState(false);
    const [hostGridSize, setHostGridSize] = useState("");
    const history = useNavigate();
    const [urlRoomId, setUrlRoomId] = useState("");
    // var urlRoomId;

    socket.on("start-game", (tempUrlRoomId)=>{
        if(playerRole==2){
            if(roomId[6]=='8'){
                setHostGridSize(8);
            }
            else{
                setHostGridSize(4);
            }
        }
        if(playerRole==1)toast.dismiss(roomCopiedToastId.current);
        setJoined(true);
        setUrlRoomId(tempUrlRoomId);
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

    useEffect(()=>{
        if(urlRoomId!=""){
            history("/room/"+urlRoomId);
        }
    }, [urlRoomId])

    useEffect(()=>{
        var curUrl = JSON.stringify(window.location.href)
        console.log(performance.getEntriesByType("navigation")[0].type, curUrl.substring(curUrl.length-6, curUrl.length-1));
        if(curUrl.substring(curUrl.length-6, curUrl.length-1)!="room/" && curUrl.substring(curUrl.length-5, curUrl.length-1)!="room"){
            history("/");
        }
    }, [])

    return (
        <>
            <Routes>
                <Route path = "/" element = {
                    <div>
                        <Header gridSize={props.gridSize}/>
                        {!shared?
                        <div className="rooms-main-container">
                            {/* <Link to={"/"+roomCode} style={{textDecoration: "none"}}> */}
                                <div className="create-room-container">
                                    <button 
                                        className="create-room" 
                                        onClick={()=>{
                                            setHostGridSize(props.gridSize);
                                            idCopied();
                                            setShared(true);
                                            if(props.gridSize==8){
                                                var tempRoomCode = generateRandomString(6)+"8";
                                            }
                                            else{
                                                var tempRoomCode = generateRandomString(6);
                                            }
                                            setRoomCode(tempRoomCode);
                                            socket.emit("room-created", tempRoomCode);
                                            setPlayerRole(1)
                                            navigator.clipboard.writeText(tempRoomCode)
                                            }
                                        }>    
                                    </button>
                                </div>
                            {/* </Link> */}
                            {/* <Link to={"/"+roomId} style={{textDecoration: "none"}}> */}
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
                                    :null
                                    }
                                </div>
                            {/* </Link> */}
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
                    </div>}
                />
                {console.log("roomCode: "+urlRoomId)}
                <Route path = {"/"+urlRoomId} element = {<Game gridSize={hostGridSize} roomId={playerRole==1?roomCode:roomId} socketId={socket.id} playerRole={playerRole}/>} />
            </Routes>
        </>
  )
}




        // {joined?
        //     <Route exact path={"/"+playerRole==1?roomCode:roomId} element={
        //         <Game gridSize={hostGridSize} roomId={playerRole==1?roomCode:roomId} socketId={socket.id} playerRole={playerRole}/>
        //     }/>
        //     :
        //     <Route exact path={"/"} element={
        //     <div>
        //         <Header gridSize={props.gridSize} fromMidGame={false}/>
        //         {!shared?
        //         <div className="rooms-main-container">
        //             <div className="create-room-container">
        //                 <button 
        //                     className="create-room" 
        //                     onClick={()=>{
        //                         setHostGridSize(props.gridSize);
        //                         idCopied();
        //                         setShared(true);
        //                         if(props.gridSize==8){
        //                             var tempRoomCode = generateRandomString(6)+"8";
        //                         }
        //                         else{
        //                             var tempRoomCode = generateRandomString(6);
        //                         }
        //                         setRoomCode(tempRoomCode);
        //                         // console.log(tempRoomCode);
        //                         socket.emit("room-created", tempRoomCode);
        //                         setPlayerRole(1)
        //                         navigator.clipboard.writeText(tempRoomCode)
        //                         }
        //                     }>    
        //                 </button>
        //             </div>
        //             <div className="join-room-container">
        //                 <input 
        //                     className="room-input" 
        //                     type="text" 
        //                     style={roomId!==""?{marginRight: "10px"}:{marginRight:"0px"}}
        //                     onChange={(e)=>{
        //                         setRoomId(e.target.value);
        //                     }} 
        //                     onKeyPress={(e)=>{
        //                         if(e.key==="Enter"){
        //                             setPlayerRole(2)
        //                             socket.emit("joined-room", roomId);
        //                         }
        //                     }}
        //                 />
        //                 {roomId!==""?
        //                     <button className="join-room"   
        //                         onClick={()=>{
        //                             setPlayerRole(2);
        //                             socket.emit("joined-room", roomId)
        //                         }}>
        //                     Join
        //                     </button>
        //                 :console.log("Enter Room Id")
        //                 }
        //             </div>
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
        //     </div> }/>}