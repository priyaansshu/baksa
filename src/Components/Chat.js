import React, {useState, useEffect} from 'react'
import "../style.css";
import {io} from "socket.io-client";

const socket = io('http://localhost:4000');

export default function Chat(props) {
    const [message, setMessage]= useState("");
    var chatColor = props.chatColor=="#c5183b"?"rgba(195, 24, 58, 0.5)":"rgba(59, 146, 155, 0.5)";

    function sendMessage(tempMessage){
        var tempMessageArr = [...props.messageArr];
        console.log(tempMessageArr);
        tempMessageArr.push(message);
        props.setMessageArr(tempMessageArr);
        console.log(tempMessageArr);
        socket.emit("message", {roomId: props.roomId, tempMessage: tempMessage});
      }
    
      useEffect(()=>{
        socket.on("message", (message)=>{
            console.log("message received");
          var tempMessageArr = [...props.messageArr];
          console.log(tempMessageArr);
          tempMessageArr.push(message);
          props.setMessageArr(tempMessageArr);
        })
      }, [socket]);

    return (
    <>
        {JSON.stringify(props.messageArr)}
        <div className="chat-outer-container">
            <div className="chat-main-container">
                {props.messageArr.map((message, index)=>{
                    return(
                        <div 
                            className="chat-message-container" 
                            key={index}
                            style={{backgroundColor: chatColor}}
                        >
                                <p className="chat-message-text">{message}</p>
                        </div>
                    )
                })}
                <div className="chat-input-container">
                    <input 
                        type="text" 
                        className="chat-input"
                        placeholder="Type a message..."
                        onKeyPress={(e)=>{
                            if(e.key==="Enter"){
                                sendMessage(e.target.value);
                                e.target.value="";
                            }
                        }}
                        onChange={(e)=>{
                            setMessage(e.target.value);
                        }}
                    />
                    <button
                        className="chat-send-button"
                        onClick={()=>{
                            sendMessage(message);
                            setMessage("");
                        }
                        }
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    </>
  )
}
