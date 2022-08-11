import React, {useState, useEffect} from 'react'
import "../style.css"
import {Route, Link, Routes, useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti'
import {io} from "socket.io-client"

// const socket = io('https://baksa19.herokuapp.com/', { transports : ['websocket'] });
// const socket = io('http://localhost:4000', { transports : ['websocket'] });

export default function GameOver(props) {
    var result;
    const [gridSize, setGridSize] = useState(4);
    const [hideWinner, setHideWinner] = useState("flex");
    const [showShare, setShowShare] = useState("none");
    const [showConfetti, setShowConfetti] = useState(true);
    const [recycleConfetti, setRecycleConfetti] = useState(true);
    const [startRematch, setStartRematch] = useState(false);
    const [roomId, setRoomId] = useState();
    const [playerRole, setPlayerRole] = useState();
    const history = useNavigate();

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
    
    const newRoomId = generateRandomString(6);

    (function calcResult(){
        if(props.gameLeaveWinner=="none"){
            if(props.redScore>props.blueScore){
                result = "red";
            }
            else if(props.redScore<props.blueScore){
                result = "blue";
            }
            else{
                result = "draw";
            }
        }
        else{
            result = props.gameLeaveWinner
        }
    })();
    
    function createEmoji(){
        var i=0;
        if(result == "draw"){
            var message = "It's a draw\n\n";
        }
        else if(result=="red"){
            message = "👑 Red\n\n";
        }
        else{
            message = "👑 Blue\n\n";
        }
        for (const [key, value] of props.boxMap.entries()) {
            if(props.gridSize==4){
                if(i==4){
                    message+="\n";
                    i=0;
                }
            }
            else{
                if(i==8){
                    message+="\n";
                    i=0;
                }
            }
            if(value=="#c5183b"){
                message+="🟥";
            }
            else if(value=="#3b919b"){
                message+="🟦";
            }
            else{
                message+="⬜️";
            }
            i++;
        }   
        // console.log(message);
        navigator.clipboard.writeText(message);
    }

    function resultCopied (){
        toast("Result copied to clipboard", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });  
    } 

    // useEffect(()=>{
    //     console.log("here");
    //     socket.on("new-room-id", ({tempNewRoomId})=>{
    //         console.log("new-room")
    //         setRoomId(tempNewRoomId);
    //         setPlayerRole(2);
    //         history("/room/"+tempNewRoomId);
    //         setStartRematch(true);
    //         socket.emit("join-rematch-room", {tempNewRoomId});
    //     })
    // }, [socket]);


    // useEffect(()=>{
    //     if(props.gameOver){
    //         console.log("here");
    //         setTimeout(()=>{
    //             setShowConfetti(true);
    //         }
    //         ,2000);
    //         setTimeout(()=>{
    //             setRecycleConfetti(false);
    //         }
    //         ,5000);
    //     }
    // }, [props.gameOver])

    return (
    <>
        {/* {showConfetti && 
            <Confetti 
                colors = {result=="blue"?["#3b919b"]:["#c5183b"]}
                numberOfPieces = {80}
                recycle = {recycleConfetti}
            />
        }  */}
        <div className="logo-container"></div>
        {props.gameLeaveWinner!="none"?
            <div className="game-leave-message">
                The other player left the room.
            </div>
            :
            null
        }
        <div className="winner-outer-container">
            <div 
                className="winner-container" 
                id={result+"-winner-container"} 
                onClick={()=>{
                    resultCopied();
                    createEmoji();
                }}
                data-hover={"share"}
            >
                <div 
                    className="winner-text-container" 
                    style={{display: hideWinner}}
                >
                        <h2 
                            className="winner-text">
                                {result=="draw"?"Draw":result+" wins"}
                                <div className = "share-image-container"/>
                        </h2>
                </div>
            </div>
        </div>
        <button 
            className="grid-button" 
            id={props.gridSize==4?"four-button":"eight-button"} 
            onClick={()=>{
                history("/")
                // var tempNewRoomId = generateRandomString(6);
                // console.log(props.curRoomId);
                // socket.emit("create-rematch-room", ({curRoomId: props.curRoomId, tempNewRoomId: tempNewRoomId}));
                // history("/room/"+tempNewRoomId);
                // setPlayerRole(1);
                // setRoomId(tempNewRoomId);
                // setStartRematch(true);
            }}
            >
            Go Again
        </button>
        {/* {startRematch &&
            <Game2 
                gridSize={props.gridSize}
                roomId={roomId}
                socketId={socket.id}
                playerRole={playerRole}
            />
        } */}
    </>
  )
}
