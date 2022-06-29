import logo from './logo.svg';
import './App.css';
import react, {useState, useEffect} from 'react';
import "./style.css";
import Dot from './Components/Dot';
import Grid from './Components/Grid';
import Header from './Components/Header';
import GameOver from './Components/GameOver';
// import {io} from "socket.io-client";

// const socket = io('http://localhost:4000');

export default function Game(props) {
  var i, j;
  var tempBoxCount = 0;
  var compTempPos;
  var compBoxFlag = false;
  var comp2line = false;
  const [elMap, setMap] = useState(new Map());
  const [turn, setTurn] = useState("#c5183b");
  const [mapFlag, setMapFlag] = useState(true);
  const [boxFlag, setBoxFlag] = useState(true);
  const [boxMap, setBoxMap] = useState(new Map());
  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  var position;

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

  useEffect(()=>{
    setMap(elMap.set(position, "clicked"));
  }, [turn]);

  function elementCheck(id, compFlag, elRef){
    // socket.emit("turn", turn, props.roomId);
    position = calcPosition(id);
    if(!compFlag){
      // socket.on("set-turn", turn=>{
        setTurnFunc();
      // });
    }
    // socket.emit("elMap-update")
    if(id.charAt(0) == "h"){
      checkVerticalBoxes(id, position);
    }
    else{
      checkHorizontalBoxes(id, position);
    }

    // if(compFlag){
    //   compFunc(elRef);
    // }
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
    setTurn(turn=="#c5183b"?"#3b919b":"#c5183b");
  }

  function stayTurn(){
    setTurn(turn=="#c5183b"?"#c5183b":"#3b919b")
  }

  function checkVerticalBoxes(id){
    console.log(id);
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
    
    var boxColor = turn=="#3b919b"?"#3b919b":"#c5183b";
    if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
        console.log("upper and lower boxes filled");
      setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn();
      updateScore(("b-"+(n-1)+"-"+m));
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked" && elMap.get(pos4)=="clicked"){
        console.log("upper box filled");
      setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
      stayTurn();
      updateScore(("b-"+(n-1)+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
        console.log("lower box filled");
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn();
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
  }
  
  function checkHorizontalBoxes(id){
    console.log(id);
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

    var boxColor = turn=="#3b919b"?"#3b919b":"#c5183b";
    if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
      console.log("left and right boxes filled");
      setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn();
      updateScore(("b-"+n+"-"+(m-1)));
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
    else if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked"){
      console.log("left box filled");
      setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
      stayTurn();
      updateScore(("b-"+n+"-"+(m-1)));
      updateTotal();
    }
    else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
      console.log("right box filled");
      setBoxMap(boxMap.set(("b-"+n+"-"+m), boxColor));
      stayTurn();
      updateScore(("b-"+n+"-"+m));
      updateTotal();
    }
  }

  function updateScore(tempBoxId){
    if(boxMap.get(tempBoxId)=="#c5183b"){
      setRedScore(redScore=>redScore+1);
    }
    else if(boxMap.get(tempBoxId)=="#3b919b"){
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
    
  //   var boxColor = turn=="#3b919b"?"#3b919b":"#c5183b";

  //   if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
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
  //     elRef.current.style.backgroundColor = "#3b919b";
  //     setBoxMap(boxMap.set(("b-"+(n-1)+"-"+m), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+(n-1)+"-"+m));
  //     updateTotal();
  //   }
  //   else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
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

  //   var boxColor = turn=="#3b919b"?"#3b919b":"#c5183b";

  //   if(elMap.get(pos1)=="clicked" && elMap.get(pos2)== "clicked" && elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
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
  //     elRef.current.style.backgroundColor = "#3b919b";
  //     setBoxMap(boxMap.set("b-"+n+"-"+(m-1), boxColor));
  //     stayTurn();
  //     updateScore(("b-"+n+"-"+(m-1)));
  //     updateTotal();
  //   }
  //   else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked" && elMap.get(pos6)== "clicked"){
  //     compBoxFlag = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
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
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos1)=="clicked" && elMap.get(pos4)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   if(elMap.get(pos3)=="clicked" && elMap.get(pos4)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos2)== "clicked" && elMap.get(pos5)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos2)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos5)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
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
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos1)=="clicked" && elMap.get(pos3)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   if(elMap.get(pos2)=="clicked" && elMap.get(pos3)== "clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos4)== "clicked" && elMap.get(pos5)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos4)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
  //   }
  //   else if(elMap.get(pos5)== "clicked" && elMap.get(pos6)=="clicked"){
  //     comp2line = true;
  //     compTempPos = calcPosition(id);
  //     elMap.set(compTempPos, "clicked");
  //     elRef.current.style.backgroundColor = "#3b919b";
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
  //             elRef.current.style.backgroundColor = "#3b919b";
  //           }
  //           if(elMap.get(calcPosition(compTempId2))!="clicked"){
  //             comp0line = true;
  //             compTempPos = calcPosition(compTempId2);
  //             elMap.set(compTempPos, "clicked");
  //             elRef.current.style.backgroundColor = "#3b919b";
  //           }
  //         }  
  //       }
  //     }
  //   }
  // }
  
  return (
    <>
    {console.log("current turn: "+turn)}
    <Header gridSize={props.gridSize}/>
      <div className="center-container">
        <div className={!gameOver?"show-grid":"hide-grid"}>
          <Grid 
            gridSize={props.gridSize}
            func={elementCheck}  
            turn={turn} 
            map={elMap} 
            boxMap={boxMap} 
            vsComp={props.vsComp} 
          />
          {/* <Grid 
            gridSize={props.gridSize} 
            func={elementCheck} 
            turn={turn} 
            map={elMap} 
            boxMap={boxMap} 
            vsComp={props.vsComp} 
            compFunc={compFunc}
          /> */}
        </div>
        <div className={!gameOver?"hide-game-over":"show-game-over"}>
          <GameOver redScore={redScore} blueScore={blueScore} gridSize={props.gridSize} boxMap={boxMap}/>
        </div>
        <div className={!gameOver?"score-container":"hide-score-container"}>
          <h2 className="score" id={turn=="#c5183b"?"turn-score-red":"score-red"}>Red: {redScore}</h2>
          <h2 className="score" id={turn=="#3b919b"?"turn-score-blue":"score-blue"}>Blue: {blueScore}</h2>
        </div>
      </div>
    </>
  );
}