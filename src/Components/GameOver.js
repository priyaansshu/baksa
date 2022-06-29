import React, {useState} from 'react'
import "../style.css"
import {Route, Link, Routes} from "react-router-dom";
import Game from "../Game.js"

export default function GameOver(props) {
    var result;
    const [gridSize, setGridSize] = useState(4);
    const [hideWinner, setHideWinner] = useState("flex");
    const [showShare, setShowShare] = useState("none");
    
    (function calcResult(){
        if(props.redScore>props.blueScore){
            result = "red";
        }
        else if(props.redScore<props.blueScore){
            result = "blue";
        }
        else{
            result = "draw";
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
            else{
                message+="🟦";
            }
            i++;
        }   
        console.log(message);
        navigator.clipboard.writeText(message);
        window.alert("Result shared to clipboard!");
    }

    return (
    <>
        <div className="logo-container"></div>
        <div className="winner-outer-container">
            <div 
                className="winner-container" 
                id={result+"-winner-container"} 
                onMouseEnter={()=>{setHideWinner("none"); setShowShare("flex")}} 
                onMouseLeave={()=>{setHideWinner("flex"); setShowShare("none")}}
                onClick={()=>{
                    console.log("hello");
                    createEmoji();
                }}
            >
                    <div 
                        className="winner-text-container" 
                        style={{display: hideWinner}}
                    >
                            <h2 
                                className="winner-text">
                                    {result=="draw"?"It's a draw":result+" wins"}
                            </h2>
                    </div>
                    <div 
                        className="share-container" 
                        style={{display: showShare}} 
                    >
                </div>
            </div>
        </div>
        <button 
            className="grid-button" 
            id={props.gridSize==4?"four-button":"eight-button"} 
            onClick={()=>{window.location.reload(false)}}
        >
            Go Again
        </button>
    </>
  )
}
