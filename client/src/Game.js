import logo from './logo.svg';
import './App.css';
import react, {useState, useEffect, useRef} from 'react';
import "./style.css";
import Dot from './Components/Dot';
import Grid from './Components/Grid';
import GameOver from './Components/GameOver';
import Header from './Components/Header';
import {io} from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import { css } from "glamor";
import Chat from './Components/Chat';
import {Route, Link, Routes, Navigate, useNavigate} from "react-router-dom";
import { useBeforeunload } from 'react-beforeunload';
import useScreenType from "react-screentype-hook";

const socket = io('https://baksa19.herokuapp.com/', { transports : ['websocket'] });
// const socket = io('http://localhost:4000');

export default function Game(props) {
  var i, j;
  var tempBoxCount = 0;
  var compTempPos;
  var compBoxFlag = false;
  var comp2line = false;
  const [elMap, setMap] = useState(new Map());
  const [boxMap, setBoxMap] = useState(new Map());
  
  const [mapFlag, setMapFlag] = useState(true); //used to make sure the map is initialised only once
  const [boxFlag, setBoxFlag] = useState(true); //used to make sure the box map is initialised only once
  
  var red="#c5183b";
  var blue="#3b919b";
  const assignedColor = props.playerRole==1?red:blue;

  const [turn, setTurn] = useState(red);
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  var position;
  const [tempId, setTempId] = useState("");
  const [tempColor, setTempColor] = useState("");

  const [finalRoomId, setFinalRoomId] = useState("");
  
  const [messageArr, setMessageArr] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSeen, setLastSeen] = useState(0);

  const chatRef = useRef();
  const gridRef = useRef();
  const chatButtonRef = useRef();
  const yourTurnRef = useRef();

  const [gameLeaveWinner, setGameLeaveWinner] = useState("none");
  const [playerLeft, setPlayerLeft] = useState(false);
  const [playerOnMobile, setPlayerOnMobile] = useState();
  const [opponentOnMobile, setOpponentOnMobile] = useState();
  const [ locationKeys, setLocationKeys ] = useState([])
  const screenType = useScreenType();
  const history = useNavigate()
  var localTurn;

  const [movesArr, setMovesArr] = useState([]);
  const [showLastMove, setShowLastMove] = useState(false);

  var t; // variable for temporarily handling id
  var tempTurn; // variable for temporarily handling turn
  var tempBoxColor="";
  // var tempTimeoutId;

  useEffect(()=>{
    var curUrl = JSON.stringify(window.location.href);
    if(curUrl.substring(curUrl.length-8, curUrl.length-1)=="offline"){
      props.setVsComp(true);
    }
  }, [])

  useEffect(()=>{
    console.log(props.socketId)
    var tempRoomId = props.roomId+"1";
    socket.emit("rejoin", {roomId: tempRoomId});
  }, [])

  useEffect(()=>{
    socket.on("final-room", ({roomId})=>{
      setFinalRoomId(roomId);
    })
  }, [socket]);

  function updateMapWithServer(){
    // console.log("received");
    // socket.emit("test", {roomId: finalRoomId, socketId: props.socketId});
    socket.emit("update", {turn: tempTurn, roomId: finalRoomId, socketId: props.socketId, position: position, tempId: t, tempBoxColor: tempBoxColor});
  }
  
  useEffect(()=>{
    // console.log(socket);
    socket.on("updated", (data)=>{
      position = data.position;
      tempBoxColor = data.tempBoxColor;

      var tempMovesArr = [...movesArr];
      tempMovesArr.push(data.tempId);
      setMovesArr(tempMovesArr);

      updateLocalVariablesWithServerValues(data.tempId, data.turn);
      elementCheckUtilityFunction(position, data.tempId);
    });
  }, [socket]);

  function updateLocalVariablesWithServerValues(tempId, tempColor){
    setTempId(tempId);
    setTempColor(tempColor);
    localTurn = tempColor;
  }

  (function initMap(){
    if(mapFlag){
      var tempSize = props.gridSize==4?65:225;
      for(i=0; i<tempSize; ++i){
      // for(i=0; i<props.gridSize==4?65:225; ++i){
        elMap.set(i, "unclicked");
      }
      setMapFlag(false);
    }
  })();

  (function initBoxMap(){
    if(boxFlag){
      for(i=1; i<=props.gridSize; ++i){
      // for(i=1; i<=4; ++i){
        for(j=1; j<=props.gridSize; ++j)
        // for(j=1; j<=4; ++j)
          boxMap.set("b-"+i+"-"+j, "transparent");
      }
      setBoxFlag(false);
    }
  })();

  function updateMap(position){
    if(elMap.get(position)!=="clicked"){
      setMap(elMap.set(position, "clicked"));
      // console.log(elMap);
    }
  }

  function elementCheckUtilityFunction(position, id){
    // console.log("here");
    updateMap(position);
    setTurnFunc();
    if(id.charAt(0) == "h"){
      checkVerticalBoxes(id);
    }
    else{
      checkHorizontalBoxes(id);
    }
  }

  function elementCheck(id){
    // console.log(tempTimeoutId)
    // if(yourTurnRef.current.style.display==="flex"){
    //   yourTurnRef.current.style.display = "none"
    // }
    // if(tempTimeoutId){
    //   clearTimeout(tempTimeoutId);
    // }
    if(props.vsComp){
      var tempMovesArr = [...movesArr];
      tempMovesArr.push(id);
      setMovesArr(tempMovesArr);
    }
    // console.log(elMap);
    t=id;
    tempBoxColor=""
    position = calcPosition(id);
    // console.log(position);
    elementCheckUtilityFunction(position, id);
    tempTurn = turn;
    if(!props.vsComp)
      updateMapWithServer();
  }
  
  function calcPosition(id){
    var part1=0, part2=0, position=0;
    if(id.charAt(0)=="d"){
      part1 = 14*(parseInt(id.charAt(2))-1);
      part2 = 2*(parseInt(id.charAt(4)))-2;
    }
    else if(id.charAt(0)=="h"){
      part1 = 14*(parseInt(id.charAt(2))-1);
      part2 = 2*(parseInt(id.charAt(4)))-1;
    }
    else{
      part1 = 14*(parseInt(id.charAt(2)))-5;
      part2 = parseInt(id.charAt(4));
    }
    position = part1 + part2;
    // console.log(position);
    return position;
  }

  function setTurnFunc(){
    setTurn(turn=>turn===red?blue:red);
    // console.log("In the setTurn function: "+turn);
  }

  function stayTurn(boxColor){
    setTurn(boxColor);
  }

  function checkVerticalBoxes(id){
    // console.log(id);
    var id1, id2, id3, id4, id5, id6;
    var pos1, pos2, pos3, pos4, pos5, pos6;
    var n = parseInt(id.charAt(2)), m = parseInt(id.charAt(4));
    id1="h-"+(n-1)+"-"+m;
    id2="h-"+(n+1)+"-"+m;
    id3="v-"+(n-1)+"-"+m;
    id4="v-"+(n-1)+"-"+(m+1);
    id5="v-"+(n)+"-"+m;
    id6="v-"+(n)+"-"+(m+1);
    pos1=calcPosition(id1);
    pos2=calcPosition(id2);
    pos3=calcPosition(id3);
    pos4=calcPosition(id4);
    pos5=calcPosition(id5);
    pos6=calcPosition(id6);
    
    if(tempBoxColor==""){
      var boxColor = turn;
    }
    else{
      var boxColor = tempBoxColor;
    }

    if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
        // console.log("upper and lower boxes filled");
      setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+(n-1)+"-"+m));
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked" && elMap.get(pos4)=="clicked"){
        // console.log("upper box filled");
      setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+(n-1)+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
        // console.log("lower box filled");
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }

    // console.log(boxMap);
    tempBoxColor=boxColor;
  }
  
  function checkHorizontalBoxes(id){
    // console.log(id);
    var id1, id2, id3, id4, id5, id6;
    var pos1, pos2, pos3, pos4, pos5, pos6;
    var n = parseInt(id.charAt(2)), m = parseInt(id.charAt(4));
    id1="h-"+(n)+"-"+(m-1);
    id2="v-"+(n)+"-"+(m-1);
    id3="h-"+(n+1)+"-"+(m-1);
    id4="h-"+(n)+"-"+(m);
    id5="v-"+(n)+"-"+(m+1);
    id6="h-"+(n+1)+"-"+(m);
    pos1=calcPosition(id1);
    pos2=calcPosition(id2);
    pos3=calcPosition(id3);
    pos4=calcPosition(id4);
    pos5=calcPosition(id5);
    pos6=calcPosition(id6);

    if(tempBoxColor==""){
      var boxColor = turn;
    }
    else{
      var boxColor = tempBoxColor;
    }

    if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
      // console.log("left and right boxes filled");
      setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+(m-1)));
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked"){
      // console.log("left box filled");
      setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+(m-1)));
      updateTotal();
    }
    else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
      // console.log("right box filled");
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    // console.log(boxMap);
    tempBoxColor=boxColor;
  }

  function updateScore(tempBoxId){
    if(boxMap.get(tempBoxId)==red){
      setRedScore(redScore=>redScore+1);
    }
    else if(boxMap.get(tempBoxId)==blue){
      setBlueScore(blueScore=>blueScore+1);
    }
  }

  function updateTotal(){
    tempBoxCount=0;
    for (const [key, value] of boxMap.entries()) {
      if(value!="transparent"){
        // console.log(key+": "+value);
        tempBoxCount++;
      }
    }
    // console.log("tempBoxCount: "+tempBoxCount);
    if(props.gridSize == 4){
      if(tempBoxCount == 16){
        setGameOver(true);
        // history("/gameover")
        // props.setTempGameOverVariable(true);
      }
    }
    else if(props.gridSize == 8){
      if(tempBoxCount == 64){
        setGameOver(true);
        // history("/gameover")
        // props.setTempGameOverVariable(true);
      }
    }    
    // console.log("totalScore: "+(redScore+blueScore));
    // if(props.gridSize == 4 && redScore+blueScore == 15){
    //   setGameOver(true);
    // }
    // else if(props.gridSize == 8 && redScore+blueScore == 63){
    //   setGameOver(true);
    // }
  }
  
  // function compCheckVerticalBoxes(id, elRef){
  //   // console.log(id);
  //   var id1, id2, id3, id4, id5, id6;
  //   var pos1, pos2, pos3, pos4, pos5, pos6;
  //   var n = parseInt(id.charAt(2)), m = parseInt(id.charAt(4));
  //   id1="h-"+(n-1)+"-"+m;
  //   id2="h-"+(n+1)+"-"+m;
  //   id3="v-"+(n-1)+"-"+m;
  //   id4="v-"+(n-1)+"-"+(m+1);
  //   id5="v-"+(n)+"-"+m;
  //   id6="v-"+(n)+"-"+(m+1);
  //   pos1=calcPosition(id1);
  //   pos2=calcPosition(id2);
  //   pos3=calcPosition(id3);
  //   pos4=calcPosition(id4);
  //   pos5=calcPosition(id5);
  //   pos6=calcPosition(id6);
    
  //   var boxColor = turn==blue?blue:red;

  //   if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //     setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
  //     setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+(n-1)+"-"+m));
  //     updateScore(("b-"+n+"-"+m));
  //     updateTotal();
  //   }
  //   else if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked" && elMap.get(pos4)=="clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //     setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+(n-1)+"-"+m));
  //     updateTotal();
  //   }
  //   else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //     setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+n+"-"+m));
  //     updateTotal();
  //   }
  // }

  // function compCheckHorizontalBoxes(id, elRef){
  //   // console.log(id);
  //   var id1, id2, id3, id4, id5, id6;
  //   var pos1, pos2, pos3, pos4, pos5, pos6;
  //   var n = parseInt(id.charAt(2)), m = parseInt(id.charAt(4));
  //   id1="h-"+(n)+"-"+(m-1);
  //   id2="v-"+(n)+"-"+(m-1);
  //   id3="h-"+(n+1)+"-"+(m-1);
  //   id4="h-"+(n)+"-"+(m);
  //   id5="v-"+(n)+"-"+(m+1);
  //   id6="h-"+(n+1)+"-"+(m);
  //   pos1=calcPosition(id1);
  //   pos2=calcPosition(id2);
  //   pos3=calcPosition(id3);
  //   pos4=calcPosition(id4);
  //   pos5=calcPosition(id5);
  //   pos6=calcPosition(id6);

  //   var boxColor = turn==blue?blue:red;

  //   if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //     setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
  //     setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+n+"-"+(m-1)));
  //     updateScore(("b-"+n+"-"+m));
  //     updateTotal();
  //   }
  //   else if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //     setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+n+"-"+(m-1)));
  //     updateTotal();
  //   }
  //   else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //     setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+n+"-"+m));
  //     updateTotal();
  //   }
  // }

  // function compCheck1lineHorizontal(id, elRef){
  //   console.log(id);
  //   var id1, id2, id3, id4, id5, id6;
  //   var pos1, pos2, pos3, pos4, pos5, pos6;
  //   var n = parseInt(id.charAt(2)), m = parseInt(id.charAt(4));
  //   id1="h-"+(n-1)+"-"+m;
  //   id2="h-"+(n+1)+"-"+m;
  //   id3="v-"+(n-1)+"-"+m;
  //   id4="v-"+(n-1)+"-"+(m+1);
  //   id5="v-"+(n)+"-"+m;
  //   id6="v-"+(n)+"-"+(m+1);
  //   pos1=calcPosition(id1);
  //   pos2=calcPosition(id2);
  //   pos3=calcPosition(id3);
  //   pos4=calcPosition(id4);
  //   pos5=calcPosition(id5);
  //   pos6=calcPosition(id6);

  //   if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos1)=="clicked" && elMap.get(pos4)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   if(elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos2)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos5)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  // }

  // function compCheck1lineVertical(id, elRef){
  //   console.log(id);
  //   var id1, id2, id3, id4, id5, id6;
  //   var pos1, pos2, pos3, pos4, pos5, pos6;
  //   var n = parseInt(id.charAt(2)), m = parseInt(id.charAt(4));
  //   id1="h-"+(n)+"-"+(m-1);
  //   id2="v-"+(n)+"-"+(m-1);
  //   id3="h-"+(n+1)+"-"+(m-1);
  //   id4="h-"+(n)+"-"+(m);
  //   id5="v-"+(n)+"-"+(m+1);
  //   id6="h-"+(n+1)+"-"+(m);
  //   pos1=calcPosition(id1);
  //   pos2=calcPosition(id2);
  //   pos3=calcPosition(id3);
  //   pos4=calcPosition(id4);
  //   pos5=calcPosition(id5);
  //   pos6=calcPosition(id6);

  //   if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   if(elMap.get(pos2)=="clicked" && elMap.get(pos3)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos4)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  //   else if(elMap.get(pos5)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = blue;
  //   }
  // }

  // function compFunc(elRef){
  //   console.log("computer's turn");
  //   console.log(elMap);
  //   compBoxFlag = false;
  //   var comp1line = false;
  //   var comp0line = false;

  //   if(compBoxFlag == false){
  //     // check box completion
  //     console.log("check box completion")
  //     for(var i=1; i<=props.gridSize+1; ++i){
  //       for(var j=1; j<=props.gridSize; ++j){
  //         var compTempId1 = "h-"+[i]+"-"+[j];
  //         var compTempId2 = "v-"+[j]+"-"+[i];
  //         while(compBoxFlag == false){
  //           if(elMap.get(calcPosition(compTempId1))!="clicked"){
  //             compCheckVerticalBoxes(compTempId1, elRef);
  //           }
  //           if(elMap.get(calcPosition(compTempId2))!="clicked"){
  //             compCheckHorizontalBoxes(compTempId2, elRef);
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if(compBoxFlag == false && comp1line == false && comp0line == false){
  //     // check 0 line clicked
  //     console.log("check 0 line clicked")
  //     for(var i=1; i<=props.gridSize+1; ++i){
  //       for(var j=1; j<=props.gridSize; ++j){
  //         var compTempId1 = "h-"+[i]+"-"+[j];
  //         var compTempId2 = "v-"+[j]+"-"+[i];
  //         while(comp0line == false){
  //           if(elMap.get(calcPosition(compTempId1))!="clicked"){
  //             comp0line = true;
  //             compTempPos = calcPosition(compTempId1);
  //             elMap.set(compTempPos, "clicked");
  //             elRef.current.style.backgroundColor = blue;
  //           }
  //           if(elMap.get(calcPosition(compTempId2))!="clicked"){
  //             comp0line = true;
  //             compTempPos = calcPosition(compTempId2);
  //             elMap.set(compTempPos, "clicked");
  //             elRef.current.style.backgroundColor = blue;
  //           }
  //         }  
  //       }
  //     }
  //   }
  // }
  
  const playerColorToastId = useRef(null);
  useEffect(() => {
    var curUrl = JSON.stringify(window.location.href);
    var tempVsComp;
    if(curUrl.substring(curUrl.length-8, curUrl.length-1)=="offline"){
      tempVsComp = true;
    }
    if(!tempVsComp && gridRef.current.className === "show-grid"){
      var playerColor = assignedColor=="#c5183b"?"Red":"Blue";
      playerColorToastId.current = toast("You are "+playerColor, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });  
    }
  }, []);

  function notTurnFunc(){
    toast("It's not your turn", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    }); 
  }

  // const yourTurnToastId = useRef(null);
  // useEffect(()=>{
  //   setTimeout(()=>{
  //     console.log(gridRef.current.className)
  //     if(assignedColor == turn && !props.vsComp && gridRef.current.className === "show-grid"){
  //       if(yourTurnToastId.current!=null){
  //         toast.dismiss(yourTurnToastId.current)
  //       }
  //       setTimeout(()=>{
  //         yourTurnToastId.current = toast("It's your turn", {
  //           position: "top-right",
  //           autoClose: 5000,
  //           hideProgressBar: true,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: true,
  //           progress: undefined,
  //         }); 
  //       }, 5000)
  //     }
  //   } , 1000)
  // }, [turn])

  function sendMessage(tempMessage, playerRole){
    if(tempMessage==""){
        return;
    }
    socket.emit("send-message", {roomId: finalRoomId, tempMessage: tempMessage, playerRole: playerRole});
  }

  socket.off("receive-message");
  socket.on("receive-message", (tempMessage, playerRole)=>{
      // console.log("message received");

      const tempMessageArr = [...messageArr];
      tempMessageArr.push({sender: playerRole, message: tempMessage});
      // console.log(tempMessageArr);
      setMessageArr(tempMessageArr);
    })

    useEffect(()=>{
      if(showChat){
        setLastSeen(messageArr.length);
        setUnreadCount(0);
      }
      var tempUnreadCount = messageArr.length-lastSeen;
      setUnreadCount(tempUnreadCount);
    }, [showChat])

    useEffect(()=>{
      if(showChat){
        setUnreadCount(0);
        setLastSeen(messageArr.length);
      }
      else{
        var tempUnreadCount = messageArr.length-lastSeen;
        setUnreadCount(tempUnreadCount);
      }
    }, [messageArr.length])

    useEffect(() => {
      if(showChat){
        function handleClickOutside(event) {
          if (chatRef.current && !chatRef.current.contains(event.target) && gridRef.current && !gridRef.current.contains(event.target) && chatButtonRef.current && !chatButtonRef.current.contains(event.target)) {
            setShowChat(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [showChat]);

    // socket.off("game-left");
    useEffect(()=>{
      // console.log(gridRef.current.className);
      if(!props.vsComp && gridRef.current.className === "show-grid"){
        socket.on("game-left", ({winner})=>{
          console.log("The other player left the game");
          setPlayerLeft(true);
          setGameOver(true);
          setGameLeaveWinner(winner);
        })
      }
    }, [socket])

    // useEffect(()=>{
      // console.log("playerLeft: "+playerLeft);
      // if(playerLeft){
      //   clearInterval(intervalId);
      // }
    // }, [playerLeft])

    useEffect(()=>{
      if(!props.vsComp && !playerLeft && gridRef.current.className==="show-grid"){
        var tempRoomId = finalRoomId;
        if(!playerLeft){
          const tempId = setInterval(() => {
            // console.log(gridRef.current.className)
            if(gridRef.current.className === "show-grid"){
              socket.emit("game-leave-check", ({playerRole: props.playerRole, roomId: tempRoomId}))
            }
          }, 10000);
        }
      }
    }, [finalRoomId, playerLeft])

    window.addEventListener('popstate', (event) => {
      if (event.state) {
        window.location.reload();
      }
     }, false)

    useEffect(()=>{
      window.history.pushState({name: "browserBack"}, "on browser back click", window.location.href);
      window.history.pushState({name: "browserBack"}, "on browser back click", window.location.href);
    }, []);

    useEffect(()=>{
      if(showLastMove){
        setTimeout(()=>{
          setShowLastMove(false);
        })
      }
    }, [showLastMove])

    // useEffect(()=>{
    //   if(gridRef.current.className==="show-grid" && assignedColor===turn && !props.vsComp){
    //     tempTimeoutId = setTimeout(()=>{
    //       yourTurnRef.current.style.display = "flex";

    //       console.log(yourTurnRef.current.style.display)
    //     }, 5000)
    //   }
    // }, [turn])

  return (
    <>
      {/* <div className="dont-leave-page-container" ref={yourTurnRef} style={{display: "none"}}>
          <div className="dont-leave-page-text">
              It's your turn 
          </div>
      </div> */}
      <Header gridSize={props.gridSize} gameOver={gameOver} fromMidGame={true} vsComp={props.vsComp}/>
      {!gameOver?  
        <div className="last-move-button" onClick={()=>{
          setShowLastMove(true);
        }}>
        </div>
        :null
      }
      <div className="center-container">
        <div className={!gameOver?"show-grid":"hide-grid"} ref={gridRef}>
          <Grid 
            gridSize={props.gridSize}
            func={elementCheck}  
            turn={turn} 
            map={elMap} 
            boxMap={boxMap} 
            vsComp={props.vsComp} 
            tempColor={tempColor}
            tempId={tempId}
            assignedColor={assignedColor}
            notTurnFunc = {notTurnFunc}
            showLastMove = {showLastMove}
            setShowLastMove = {setShowLastMove}
            movesArr = {movesArr}
          />
        </div>

        <div className={!gameOver?"hide-game-over":"show-game-over"}>
          <GameOver gameLeaveWinner={gameLeaveWinner} redScore={redScore} blueScore={blueScore} gridSize={props.gridSize} boxMap={boxMap} vsComp={props.vsComp} gameOver={gameOver}/>
        </div>
        {/* {console.log(turn)} */}
        <div className={!gameOver?"score-container":"hide-score-container"}>
          <h2 className="score" id={turn==red?"turn-score-red":"score-red"}>Red: {redScore}</h2>
          <h2 className="score" id={turn==blue?"turn-score-blue":"score-blue"}>Blue: {blueScore}</h2>
        </div>
        {assignedColor==turn&& !gameOver? 
          <div className={assignedColor=="#c5183b"?"yourTurnText-red":"yourTurnText-blue"}>
            <div className="baksa-image-container">
            </div>
            It's your turn
          </div>
          :null
        }
      </div>
    {!props.vsComp&&<div className={assignedColor==red?"chat-button-container-red":"chat-button-container-blue"}>
      <div ref={chatButtonRef} className="chat-button" onClick={()=>{
        setShowChat(!showChat);
      }
      }>
        <div className="unread-count-container" style={{visibility: unreadCount==0?"hidden":"visible"}}>
          {unreadCount}
        </div>
      </div>
    </div>}
    {!props.vsComp&&
      <div ref={chatRef}>
        <Chat sendMessage={sendMessage} messageArr={messageArr} chatColor={assignedColor} roomId={finalRoomId} playerRole={props.playerRole} showChat={showChat}/>
      </div>
    }
    <ToastContainer />
    </>
  );
}