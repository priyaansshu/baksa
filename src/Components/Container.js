import React, {useState} from 'react'
import Dot from "./Dot";
import "../style.css";

export default function Container(props) {
    var grid = [];
    var dotCount, horizontalCount, verticalCount;
    var keyCountHorizontal = 0, keyCountVertical = 0, boxCount = 1;
    let i;
    let rowCount = Math.floor(props.row/2)+1;
    var elPerRow = props.gridSize==4?9:17;
    (function createBoard(){
        if(props.row%2==0){
            for(i=0; i<elPerRow; ++i){
                dotCount = (keyCountHorizontal/2 + 1);
                horizontalCount = Math.ceil((keyCountHorizontal+1)/2);
                grid.push(<Dot 
                                key={keyCountHorizontal++} 
                                elementName={i%2==0?"dot":"horizontal-bar"}
                                elementId={i%2==0?"d-"+rowCount+"-"+dotCount:"h-"+rowCount+"-"+horizontalCount}
                                func={props.func}
                                turn={props.turn}
                                map={props.map}
                                boxMap={props.boxMap}
                                gridSize={props.gridSize}
                                vsComp={props.vsComp}
                                compFunc={props.compFunc}
                            />)
            }   
        }
        else{
            for(i=0; i<elPerRow; ++i){
                verticalCount = (keyCountVertical/2 + 1);
                grid.push(<Dot
                                key={keyCountVertical++}
                                elementName={i%2==0?"vertical-bar":"box"}
                                elementId={i%2==0?"v-"+rowCount+"-"+verticalCount:"b-"+rowCount+"-"+boxCount++}
                                func={props.func}
                                turn={props.turn}
                                map={props.map}
                                boxMap={props.boxMap}
                                gridSize={props.gridSize}
                                vsComp={props.vsComp}
                                compFunc={props.compFunc}
                            />)
            }
        }
    })()
    
    return (
        <>
            <div className={props.containerName} id={props.containerId}>{grid}</div>
        </>
    )
}