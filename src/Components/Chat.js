import React, {useState, useEffect, useRef} from 'react'
import "../style.css";
import {io} from "socket.io-client";
import {useSpring, animated} from "react-spring";

const socket = io('https://guarded-crag-00258.herokuapp.com/');

export default function Chat(props) {
    const [message, setMessage]= useState("");
    var bgColor = props.chatColor=="#c5183b"?"rgba(195, 24, 58, 0.5)":"rgba(59, 146, 155, 0.5)";
    var chatColor = props.chatColor=="#c5183b"?"#c5183b":"#3b919b";
    const anchorDiv = useRef();
    const inputRef = useRef();
    const styleProps = useSpring({
        visibility: props.showChat===true?"visible":"hidden",
        height: props.showChat===true?"65%":"0",
        width: window.innerWidth>768?(props.showChat===true?"22%":"0"):(props.showChat===true?"90%":"0"),
        opacity: props.showChat===true?1:0,
        config: {
            duration:150,
        }
    })
    useEffect(()=>{
        anchorDiv.current.scrollIntoView({behaviour: 'smooth'});
    }, [props.messageArr])

    return (
    <>
        <animated.div className={"chat-outer-container"} style={styleProps}>
            <div className="chat-role-container" style={{backgroundColor: props.chatColor}}>
                Chat as {chatColor=="#c5183b"?"Red":"Blue"}
            </div>
            <div className="chat-main-container" >
                {props.messageArr.map((msg, index)=>{
                    return(
                        <div 
                            className="chat-message-container" 
                            key={index}
                        >
                                <p 
                                    className="chat-message-text"
                                    style={{color: msg.sender==1?"#c5183b":"#3b919b"}}
                                >
                                        {msg.message}
                                </p>
                        </div>
                    )
                })}
                <div ref={anchorDiv}></div>
            </div>
            <div className="chat-bottom-container">
                <div className="pretyped-messages-container">
                    <div className="pretyped-message" id="emoji-1" 
                        onClick={()=>{
                            props.sendMessage(props.playerRole==1?"Red: 😂":"Blue: 😂", props.playerRole);
                        }}
                    >
                        <span role="img" aria-label="emoji">😂</span>
                    </div>
                    <div className="pretyped-message" id="emoji-2"
                        onClick={()=>{
                            props.sendMessage(props.playerRole==1?"Red: ❤️":"Blue: ❤️", props.playerRole);
                        }}
                    >
                        <span role="img" aria-label="emoji">❤️</span>
                    </div>
                    <div className="pretyped-message" id="emoji-3"
                        onClick={()=>{
                            props.sendMessage(props.playerRole==1?"Red: 😎":"Blue: 😎", props.playerRole);
                        }}
                    >
                        <span role="img" aria-label="emoji">😎</span>
                    </div>    
                    <div className="pretyped-message" id="pretyped-message-1"
                        onClick={()=>{
                            props.sendMessage("Hello", props.playerRole);
                        }
                    }>
                        <span role="text" aria-label="text">Hello</span>
                    </div>
                    <div className="pretyped-message" id="pretyped-message-2"
                        onClick={()=>{
                            props.sendMessage("GG", props.playerRole);
                        }
                    }>
                        <span role="text" aria-label="text">GG</span>
                    </div>
                    <div className="pretyped-message" id="pretyped-message-3"
                        onClick={()=>{
                            props.sendMessage("LOL", props.playerRole);
                        }
                    }>
                        <span role="text" aria-label="text">LOL</span>
                    </div>
                    <div className="pretyped-message" id="pretyped-message-4"
                        onClick={()=>{
                            props.sendMessage("Thanks", props.playerRole);
                        }
                    }>
                        <span role="text" aria-label="text">Thanks</span>
                    </div>
                    <div className="pretyped-message" id="pretyped-message-5"
                        onClick={()=>{
                            props.sendMessage("Another Round?", props.playerRole);
                        }
                    }>
                        <span role="text" aria-label="text">Another Round?</span>
                    </div>
                    <div className="pretyped-message" id="pretyped-message-6"
                        onClick={()=>{
                            props.sendMessage("Okay", props.playerRole);
                        }
                    }>
                        <span role="text" aria-label="text">Okay</span>
                    </div>
                </div>
                <div className="chat-input-container">
                    <input 
                        type="text" 
                        className="chat-input"
                        placeholder="Type a message..."
                        values={message}
                        ref={inputRef}
                        onKeyPress={(e)=>{
                            if(e.key==="Enter"){
                                props.sendMessage(e.target.value, props.playerRole);
                                e.target.value="";
                            }
                        }}
                        onChange={(e)=>{
                            setMessage(e.target.value);
                        }}
                        autoFocus
                    />
                    <button
                        className="chat-send-button"
                        onClick={()=>{
                            if(inputRef.current.value!=""){
                                props.sendMessage(message, props.playerRole);
                            }
                            setMessage("");
                            inputRef.current.value="";
                        }
                        }
                    >
                        Send
                    </button>
                </div>
            </div>
        </animated.div>
    </>
  )
}
