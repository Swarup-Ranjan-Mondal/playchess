import React, { useState } from "react";
import Players from "./components/Players";
import ChessBoard from "./components/ChessBoard";
import MoveHistory from "./components/MoveHistory";

function ChessApp() {
  const imageNameOfPieces = {
    B: "bishop_lt",
    K: "king_lt",
    N: "knight_lt",
    P: "pawn_lt",
    Q: "queen_lt",
    R: "rook_lt",
    b: "bishop_dk",
    k: "king_dk",
    n: "knight_dk",
    p: "pawn_dk",
    q: "queen_dk",
    r: "rook_dk",
  };

  const playerOptions = ["human", "engine"];
  const engineOptions = ["stockfish", "komodo"];

  const [player1, setPlayer1] = useState("human");
  const [player2, setPlayer2] = useState("engine");
  const [engine1, setEngine1] = useState("stockfish");
  const [engine2, setEngine2] = useState("stockfish");
  const [startNewGame, setStartNewGame] = useState(false);

  return (
    <div className="App">
      <div className="left_container">
        <Players
          playerOptions={playerOptions}
          engineOptions={engineOptions}
          player1={player1}
          setPlayer1={setPlayer1}
          player2={player2}
          setPlayer2={setPlayer2}
          engine1={engine1}
          setEngine1={setEngine1}
          engine2={engine2}
          setEngine2={setEngine2}
        />
        <div className="button_belt">
          <button
            id="new_game_button"
            className="btn btn_primary"
            onClick={(e) => setStartNewGame(true)}
            disabled={startNewGame}
          >
            New Game
          </button>
        </div>
      </div>
      <div className="center_container">
        <ChessBoard
          player1={player1}
          player2={player2}
          engine1={engine1}
          engine2={engine2}
          startNewGame={startNewGame}
          setStartNewGame={setStartNewGame}
          imageNameOfPieces={imageNameOfPieces}
        />
      </div>
      <div className="right_container">
        <div className="captured_pieces_row black">
          <div className="captured_pieces_group P"></div>
          <div className="captured_pieces_group B"></div>
          <div className="captured_pieces_group N"></div>
          <div className="captured_pieces_group R"></div>
          <div className="captured_pieces_group Q"></div>
        </div>
        <div className="app_board">
          <span className="player_name2">
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
          <span className="player_name1">
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
        <div className="captured_pieces_row white">
          <div className="captured_pieces_group P"></div>
          <div className="captured_pieces_group B"></div>
          <div className="captured_pieces_group N"></div>
          <div className="captured_pieces_group R"></div>
          <div className="captured_pieces_group Q"></div>
        </div>
      </div>
    </div>
  );
}

export default ChessApp;
