import React from 'react'
import Dot from "./Dot"
import Container from "./Container"
import "../style.css";

export default function Grid(props) {
    var containers = []
    let i;
    var numContainers = props.gridSize==4?9:17;
    (function createContainer(){
        for(i=0; i<numContainers; ++i){
            containers.push(<Container 
                                    key={i} 
                                    row={i}
                                    containerName={i%2==0?"horizontal-bar-container":"vertical-bar-container"}
                                    containerId={i%2==0?"horizontal-bar-container-"+Math.ceil(i/2):"vertical-bar-container-"+Math.ceil(i/2)}
                                    func={props.func}
                                    turn={props.turn}
                                    map={props.map}
                                    boxMap={props.boxMap}
                                    gridSize={props.gridSize}
                                    vsComp={props.vsComp}
                                    // compFunc={props.compFunc}
                            />)
        }
    })()
    return (
        <>
            <div className="containers">{containers}</div>
        </>
    )
}
