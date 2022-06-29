
import './App.css';
import react, {useState} from 'react';
import "./style.css";
import Game from './Game';
import Room from './Room';
import {Route, Link, Routes} from "react-router-dom";
import {io} from "socket.io-client"

const socket = io('http://localhost:4000');

function App() {
  const [gridSize, setGridSize] = useState(4);
  const [chosenMode, setChosenMode] = useState(1);
  const [vsComp, setVsComp] = useState(false);
  // (()=>{
  //   socket.emit("onload-message", "hello")
  // })()
  return(
    <>
      <Routes>
              <Route exact path="" className="home-container" element={
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
                  <p className="select-mode-statement">Select a mode to start a {gridSize==4?"4X4":"8X8"} game</p>
                  <div className="mode-buttons-container">
                    <Link to="/Room" style={{textDecoration: "none"}}>
                      <button className="mode-button" id="custom-room-button">
                        Room
                      </button>
                    </Link>
                    <Link to="/game" style={{textDecoration: "none"}}>
                      <button className="mode-button" id="vs-comp-button" onClick={()=>{setVsComp(false)}}>
                        Computer
                      </button>
                    </Link>
                  </div>
                </div>
              }/>   
              <Route exact path="/game" element={<Game gridSize={gridSize} vsComp={vsComp}/>}/>
              <Route exact path="/Room" element={<Room gridSize={gridSize}/>}/>
      </Routes>
      {/* <Footer/> */}
    </>
  )
}

export default App;



