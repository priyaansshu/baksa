import react, {useState} from 'react';
import "../../src/style.css";

export default function About() {
  return (
    <div className="about-container">
          <p className="about-text">
            Miss playing the classic dots and boxes game with your friends?
            <br/>
            <div className="about-container-baksa-title">baksa</div>
            brings all that fun online.
          </p>
        <div className="horizontal-rule"></div>
          <p className="rule-text">
            <p className="rule-heading">📌 RULES</p>
            <br/>
            Join two horizontally or vertically adjacent dots by a line, and connect the last side of the square to score a point.
          </p>
        <div className="horizontal-rule"></div>
          <p className="credits-text">
            Created by <span className="priyanshu-modi-text">Priyanshu Modi</span>
          </p>
        <div className="avatar-container">
        </div>
    </div>
  )
}

// onClick={window.open("https://priyanshumodi.live", '_blank', 'noopener,noreferrer')}