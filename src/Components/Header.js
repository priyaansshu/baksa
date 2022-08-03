import React, {useEffect} from 'react'
import "../style.css";
import {Route, Link, Routes, useNavigate} from "react-router-dom";

export default function Header(props) {
  const history = useNavigate();

  return (
    <Link to="/" style={{textDecoration: "none"}}>
        <div 
          className="header-container" 
          id={props.gridSize==4?"header-container-four":"header-container-eight"}
          onClick={()=>{
            if(!props.gameOver && props.fromMidGame && !props.vsComp){
              window.location.reload();
            }
            // else{
            //   console.log("clicked home")
            //   history.goBack;
            // }
          }}
        >
        </div>
    </Link>
  )
}
