import React, {useState, useRef} from 'react'
import ReactDOM from 'react-dom';
import "../style.css";

export default function Dot(props) {
  var canInteract = "i";
  var compFlag = false;
  var elRef = useRef(null);

  // (()=>{
  //   if(props.vsComp && props.turn == "#3b919b"){
  //     canInteract = "ui";
  //   }
  //   else if(props.vsComp && props.turn =="#c5183b"){
  //     canInteract = "i";
  //   }
  // })();

  function tempPos(id){    
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
    return position = part1 + part2;
  }

  (()=>{
    //if props.tempId is equal to props.elementId, then set backgroundColor of elRef to props.tempColor
    if(props.tempId == props.elementId){
      elRef.current.style.backgroundColor = props.tempColor;
    }
  })();

  return(
      <>
        <div 
            ref = {elRef}
            className={props.gridSize==4?(props.elementName+"-"+canInteract):"big-grid-"+(props.elementName+"-"+canInteract)}
            id={props.elementId} 
            style={
              props.elementId.charAt(0)==="b"?{backgroundColor: props.boxMap.get(props.elementId), opacity: "0.5"}:
              {opacity: "0.8"}
            }
            onClick={(e)=>{
              if(props.assignedColor==props.turn){
                if(!props.vsComp){
                  // console.log("here");
                  if(e.target.id.charAt(0)!=="d" && e.target.id.charAt(0)!=="b"){
                    var tempPosition = tempPos(e.target.id);
                    if(props.map.get(tempPosition)=="unclicked"){
                      e.target.style.backgroundColor = props.turn;
                      props.func(e.target.id);
                    }
                  }
                }
                else{
                  compFlag = true;
                  if(e.target.id.charAt(0)!=="d" && e.target.id.charAt(0)!=="b" && props.turn=="#c5183b"){
                    var tempPosition = tempPos(e.target.id);
                    if(props.map.get(tempPosition)=="unclicked"){
                      e.target.style.backgroundColor = props.turn;
                      props.func(e.target.id, compFlag, elRef);
                    }
                  }
                }
              }
              else{
                console.log("It's not your turn")
              }
            }}
        ></div>
      </>
  )
}
