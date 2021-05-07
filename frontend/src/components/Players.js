import React from "react";
import DropDown from "./DropDown";

const Players = ({
  playerOptions,
  engineOptions,
  player1,
  player2,
  setPlayer1,
  setPlayer2,
  engine1,
  setEngine1,
  engine2,
  setEngine2,
}) => {
  return (
    <>
      <div className="players">
        <div className="player1">
          <span>Player 1</span>
          <DropDown
            options={playerOptions}
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
        </div>
        <div className="player2">
          <span>Player 2</span>
          <DropDown
            options={playerOptions}
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        </div>
      </div>
      <div className="engines">
        <div className="player1">
          {player1 === "engine" && (
            <DropDown
              options={engineOptions}
              value={engine1}
              onChange={(e) => setEngine1(e.target.value)}
            />
          )}
        </div>
        <div className="player2">
          {player2 === "engine" && (
            <DropDown
              options={engineOptions}
              value={engine2}
              onChange={(e) => setEngine2(e.target.value)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Players;
