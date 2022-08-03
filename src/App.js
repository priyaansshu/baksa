
import './App.css';
import react, {useState} from 'react';
import "./style.css";
import Game from './Game';
import Room from './Room';
import {Route, Link, Routes} from "react-router-dom";
import About from '../src/Components/About';
import Header from "../src/Components/Header";

function App() {
  const [gridSize, setGridSize] = useState(4);
  const [chosenMode, setChosenMode] = useState(1);
  const [vsComp, setVsComp] = useState(false);
  const [about, setAbout] = useState(false);
  const [aboutButtonClass, setAboutButtonClass] = useState("")

  return(
    <>
      <div className={"about-button"+aboutButtonClass} onClick={()=>{
        if(about){
          setAboutButtonClass("");
          setAbout(false);
        }
        else{
          setAboutButtonClass("-clicked");
          setAbout(true);
        }
      }}>
      </div>  
      <Routes>
        <Route exact path="" className="home-container" element={about? <About/> :
          <div className="home-container">
            <div className="logo-container"></div>
            <p className="rule">Own the most boxes at the end of the game to win</p>
            <div className="grid-buttons-container">
                <button className="grid-button" id={chosenMode==1?"four-button-chosen":"four-button"} onClick={()=>{
                  setGridSize(4);
                  setChosenMode(1);
                  }}>
                    4X4
                </button>
                <button className="grid-button" id={chosenMode==2?"eight-button-chosen":"eight-button"} onClick={()=>{
                  setGridSize(8);
                  setChosenMode(2);
                  }}>
                    8X8
                </button>
            </div>
            <p className="select-mode-statement">
              Select a mode to start a {gridSize==4?"4X4":"8X8"} game
            </p>
            <div className="mode-buttons-container">
              <Link to={"/room"} style={{textDecoration: "none"}}>
                <button 
                  className="mode-button" 
                  id="custom-room-button">
                    Room
                </button>
              </Link>
              <Link to={"/offline"} style={{textDecoration: "none"}}>
                <button
                  className="mode-button"
                  id="vs-comp-button" 
                  onClick={()=>{setVsComp(true)}}> 
                    Offline
                </button>
              </Link>
            </div>
          </div>
        }/>   
        <Route exact path={"/offline"} element={<Game gridSize={gridSize} vsComp={vsComp} setVsComp={setVsComp}/>}/>
        <Route exact path={"/room/*"} element={<Room gridSize={gridSize}/>}/>
      </Routes>
    </>
  )
}

export default App;



