import react, {useState} from 'react';
import "../../src/style.css";

export default function About() {
  return (
    <div className="about-container">
          <p className="about-text">
            Miss playing the classic dots and boxes game with your friends?
            <br/>
            <span className="about-container-baksa-title">baksa</span>
            brings all that fun online.
          </p>
        <div className="horizontal-rule"></div>
          <p className="rule-text">
            <span className="rule-heading">📌 RULES</span>
            <br/>
            Join two horizontally or vertically adjacent dots by a line, and connect the last side of the square to score a point.
          </p>
        <div className="horizontal-rule"></div>
          <div className="credits-container">
            <div className="credits-text">
              Created by <span className="priyanshu-modi-text" onClick={()=>{window.open("https://priyanshumodi.live", "_blank")}}>Priyanshu Modi</span>
            </div>
            <div className="social-icons-container">
              <div className="mail-icon" onClick={()=>{window.open("mailto:priyanshumodi.1909@gmail.com", "_blank")}}></div>
              <div className="linkedin-icon" onClick={()=>{window.open("https://www.linkedin.com/in/priyanshu-modi-5675941b5/", "_blank")}}></div>
              <div className="github-icon" onClick={()=>{window.open("https://github.com/priyaansshu", "_blank")}}></div>
            </div>
          </div>
        <div className="avatar-container">
        </div>
    </div>
  )
}