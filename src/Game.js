import logo from './logo.svg';
import './App.css';
import react, {useState, useEffect} from 'react';
import "./style.css";
import Dot from './Components/Dot';
import Grid from './Components/Grid';
import GameOver from './Components/GameOver';
import Header from './Components/Header';
import {io} from "socket.io-client";

const socket = io('http://localhost:4000');

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
  const [turn, setTurn] = useState(red);
  const assignedColor = props.playerRole==1?red:blue;
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  var position;
  const [tempId, setTempId] = useState("");
  const [tempColor, setTempColor] = useState("");
  var t; // variable for temporarily handling id
  var tempTurn; // variable for temporarily handling turn
  var tempBoxColor="";

  function updateMapWithServer(){
    console.log(tempTurn=="#c5183b"?"red":"blue");
    socket.emit("update", {turn: tempTurn, roomId: props.roomId, position: position, tempId: t, tempBoxColor: tempBoxColor});
  }

  useEffect(()=>{
    socket.on("updated", (data)=>{
      console.log("*******")
      position = data.position;
      tempBoxColor = data.tempBoxColor;
      console.log(data.turn=="#c5183b"?"red":"blue");
      updateLocalVariablesWithServerValues(data.tempId, data.turn);
      elementCheckUtilityFunction(position, data.tempId);
    });
  }, [socket]);

  function updateLocalVariablesWithServerValues(tempId, tempColor){
    setTempId(tempId);
    setTempColor(tempColor);
    console.log("tempColor: "+tempColor);
  }

  (function initMap(){
    if(mapFlag){
      for(i=0; i<65; ++i){
        elMap.set(i, "unclicked");
      }
      setMapFlag(false);
    }
  })();

  (function initBoxMap(){
    if(boxFlag){
      for(i=1; i<=4; ++i){
        for(j=1; j<=4; ++j)
          boxMap.set("b-"+i+"-"+j, "transparent");
      }
      setBoxFlag(false);
    }
  })();

  function updateMap(position){
    if(elMap.get(position)!=="clicked"){
      setMap(elMap.set(position, "clicked"));
      console.log(elMap);
    }
  }

  function elementCheckUtilityFunction(position, id){
    console.log("here");
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
    console.log("*******")
    t=id;
    tempBoxColor=""
    position = calcPosition(id);
    elementCheckUtilityFunction(position, id);
    tempTurn = turn;
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
    return position;
  }

  function setTurnFunc(){
    setTurn(turn=>turn===red?blue:red);
    console.log("In the setTurn function: "+turn);
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
    
    // console.log(tempColor);
    // var boxColor = tempColor===blue?red:blue;
    if(tempBoxColor==""){
      var boxColor = turn;
    }
    else{
      var boxColor = tempBoxColor;
    }

    if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
        console.log("upper and lower boxes filled");
      setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+(n-1)+"-"+m));
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked" && elMap.get(pos4)=="clicked"){
        console.log("upper box filled");
      setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+(n-1)+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
        console.log("lower box filled");
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }

    console.log(boxMap);
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

    // console.log(tempColor);
    // var boxColor = tempColor===blue?red:blue;
    if(tempBoxColor==""){
      var boxColor = turn;
    }
    else{
      var boxColor = tempBoxColor;
    }

    if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
      console.log("left and right boxes filled");
      setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+(m-1)));
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked"){
      console.log("left box filled");
      setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+(m-1)));
      updateTotal();
    }
    else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
      console.log("right box filled");
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn(boxColor);
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    console.log(boxMap);
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
    for (const [key, value] of boxMap.entries()) {
      if(value!="transparent"){
        tempBoxCount++;
      }
    }
    if(props.gridSize == 4){
      if(tempBoxCount == 16){
        setGameOver(true);
      }
    }
    else if(props.gridSize == 8){
      if(tempBoxCount == 64){
        setGameOver(true);
      }
    }    
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
  
  return (
    <>
    {console.log(tempColor)}
    <Header gridSize={props.gridSize}/>
      <div className="center-container">
        <div className={!gameOver?"show-grid":"hide-grid"}>
          {/* {console.log(tempColor)} */}
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
          />
        </div>
        {/* <div className="uninteractable-board"
            style={assignedColor==turn?{display:"none"}:{display:"block", backgroundColor:"blue", position:"relative", height:"100px", width: "100px", zIndex:"99"}}>
        </div> */}
        <div className={!gameOver?"hide-game-over":"show-game-over"}>
          <GameOver redScore={redScore} blueScore={blueScore} gridSize={props.gridSize} boxMap={boxMap}/>
        </div>
        {console.log(turn)}
        <div className={!gameOver?"score-container":"hide-score-container"}>
          <h2 className="score" id={turn==red?"turn-score-red":"score-red"}>Red: {redScore}</h2>
          <h2 className="score" id={turn==blue?"turn-score-blue":"score-blue"}>Blue: {blueScore}</h2>
        </div>
      </div>
    </>
  );
}