import React from 'react'
import "../style.css";
import {Route, Link, Routes} from "react-router-dom";

export default function Header(props) {
  return (
    <Link to="/" style={{textDecoration: "none"}}>
        <div className="header-container" id={props.gridSize==4?"header-container-four":"header-container-eight"}></div>
    </Link>
  )
}
