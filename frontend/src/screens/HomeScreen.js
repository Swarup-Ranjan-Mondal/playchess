import React from "react";
import "../styles/home.css";

const HomeScreen = () => {
  return (
    <>
      <div className="intro-section">
        <h1>Chess Online for players of all skills and age groups</h1>
        <a href="/play/now" className="card-3d">
          <img src="/images/play-icons/play-now.png" alt="Play Now" />
          <span>Play Now</span>
        </a>
        <a href="/play/online" className="card-3d">
          <img src="/images/play-icons/play-online.png" alt="Play Now" />
          <span>Play Online</span>
        </a>
      </div>
      <div className="board-section">
        <img
          src="/images/boards/chess-board-with-pieces.png"
          alt="Chess Board"
        />
      </div>
    </>
  );
};

export default HomeScreen;
