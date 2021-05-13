import React from "react";
import { useSelector } from "react-redux";
import CapturedPiecesRow from "./CapturedPiecesRow";
import MoveHistory from "./MoveHistory";

const GameInfoSection = () => {
  const { player1, player2 } = useSelector((state) => state.players);
  const { engine1, engine2 } = useSelector((state) => state.engines);

  return (
    <section className="game-info-section">
      <CapturedPiecesRow playerSide={"black"} />
      <div className="moves-board">
        <span className="player-name2">
          {player2 === "human"
            ? `Player${player1 === "human" ? "2" : ""}`
            : `Engine${player1 === "engine" ? "2" : ""} (${
                engine2 === "stockfish"
                  ? "Stockfish 13"
                  : engine2 === "komodo"
                  ? "Komodo 12"
                  : ""
              })`}
        </span>
        <MoveHistory />
        <span className="player-name1">
          {player1 === "human"
            ? `Player${player2 === "human" ? "1" : ""}`
            : `Engine${player2 === "engine" ? "1" : ""} (${
                engine1 === "stockfish"
                  ? "Stockfish 13"
                  : engine1 === "komodo"
                  ? "Komodo 12"
                  : ""
              })`}
        </span>
      </div>
      <CapturedPiecesRow playerSide={"white"} />
    </section>
  );
};

export default GameInfoSection;
