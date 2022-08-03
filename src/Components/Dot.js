import React, {useState, useRef} from 'react'
import ReactDOM from 'react-dom';
import "../style.css";
import {ToastContainer, toast} from 'react-toastify';
import { useEffect } from 'react';

export default function Dot(props) {
  var canInteract = "i";
  var compFlag = false;
  var elRef = useRef(null);
  const [turn, setTurn] = useState();

  (()=>{
    if(!props.vsComp){
      if(props.assignedColor==props.turn){
        canInteract = "i";
      }
      else{
        canInteract = "ui";
      }
    }
  })();

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
    if(!props.vsComp){
      if(props.tempId == props.elementId){
        elRef.current.style.backgroundColor = props.tempColor;
      }
    }
  })();

  // (()=>{
  //   setTurn(props.turn=="#c5183b"?"red":"blue");
  // })();

  useEffect(()=>{
    setTurn(props.turn=="#c5183b"?"red":"blue");
  }, [props.turn])

  return(
      <>
        <div 
            ref = {elRef}
            className={props.gridSize==4?(props.elementName+"-"+canInteract+"-"+turn):"big-grid-"+(props.elementName+"-"+canInteract+"-"+turn)}
            id={props.elementId} 
            style={
              props.elementId.charAt(0)==="b"?{backgroundColor: props.boxMap.get(props.elementId), opacity: "0.5"}:
              null
            }
            onClick={(e)=>{
              if(!props.vsComp){
                if(props.assignedColor==props.turn){
                  if(e.target.id.charAt(0)!=="d" && e.target.id.charAt(0)!=="b"){
                    // console.log("clicked")
                    var tempPosition = tempPos(e.target.id);
                    if(props.map.get(tempPosition)=="unclicked"){
                      e.target.style.backgroundColor = props.turn;
                      props.func(e.target.id);
                    }
                  }
                }
                else{
                  props.notTurnFunc();
                }
              }
              else{
                if(e.target.id.charAt(0)!=="d" && e.target.id.charAt(0)!=="b"){
                  var tempPosition = tempPos(e.target.id);
                  if(props.map.get(tempPosition)=="unclicked"){
                    e.target.style.backgroundColor = props.turn;
                    props.func(e.target.id);
                  }
                }
              }
            }}
        ></div>
      </>
  )
}
