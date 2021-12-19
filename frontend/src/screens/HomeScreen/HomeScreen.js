import React, { useEffect } from "react";
import "./HomeScreen.css";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Card3D from "../../components/Card3D/Card3D";

const HomeScreen = ({ resizeObserver }) => {
  useEffect(() => {
    document.title = "Play Chess - Home";
    resizeObserver.observe(document.querySelector(".content"));
  }, []);

  return (
    <>
      <Header />

      <main className="content">
        <section className="intro-section">
          <h1>Play Chess for players of all skills and age groups</h1>

          <Link to="/play/now">
            <Card3D
              cardTitle="Play Now"
              cardImgLocation="/images/play-icons/play-now.png"
              cardColor="#bfe8fc"
            />
          </Link>

          <Link to="/play/online">
            <Card3D
              cardTitle="Play Online"
              cardImgLocation="/images/play-icons/play-online.png"
              cardColor="#faffc8"
            />
          </Link>
        </section>

        <section className="board-section">
          <img
            src="/images/boards/chess-board-with-pieces.png"
            alt="Chess Board"
          />
        </section>
      </main>
    </>
  );
};

export default HomeScreen;
