import React, { useEffect } from "react";
import axios from "axios";

const PlayNow = ({
  board,
  gameId,
  playerTurn,
  playedMove,
  player1,
  player2,
  engine1,
  engine2,
  startNewGame,
  isGameOver,
  isFetchingMove,

  getTheEngineMove,
  playTheHumanMove,
  playTheEngineMove,

  setChessBoard,
  setGameId,
  setLegalMoves,
  setPlayerTurn,
  setStartNewGame,
}) => {
  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const { data } = await axios.get("/api/play");

        setGameId(data.game_id);
        setChessBoard(data.board);
        setLegalMoves(data.legal_moves);
        setPlayerTurn("white");
      } catch (err) {
        console.log(err);
      }
    };

    fetchBoardDetails();
  }, []);

  useEffect(() => {
    const setNewGame = async () => {
      board.classList.add("waiting");

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/new-game",
        {
          game_id: gameId,
        },
        config
      );

      setChessBoard("");
      setLegalMoves(data.legal_moves);
      setChessBoard(data.board);
      document.querySelector(".moves_grid").innerHTML = "";
      board.isEnginePlaying = false;

      ["white", "black"].forEach((color) => {
        ["P", "B", "N", "R", "Q"].forEach((pieceSymbol) => {
          const capturedPiecesGroup = document.querySelector(
            `.captured_pieces_row.${color} .captured_pieces_group.${pieceSymbol}`
          );
          capturedPiecesGroup.innerHTML = "";
          capturedPiecesGroup.style.paddingLeft = "0rem";
        });
      });

      board.moveNo = 0;
      if (board.lastMove.initialSquare !== undefined) {
        board.lastMove.initialSquare.classList.remove("initial");
        board.lastMove.landingSquare.classList.remove("landing");
      }
      board.lastMove = {};

      setStartNewGame(false);
      setPlayerTurn("white");

      board.classList.remove("waiting");
    };

    if (startNewGame && !isFetchingMove) {
      setNewGame();
    }
  }, [startNewGame, isFetchingMove]);

  useEffect(() => {
    if (playedMove !== "") {
      // Considering player1 plays with white pieces and player2 plays with black pieces
      if (playerTurn === "white") {
        if (player1 === "human" && !board.isEnginePlaying) {
          playTheHumanMove(playedMove);
        } else if (player1 === "engine" || board.isEnginePlaying) {
          playTheEngineMove(playedMove);
          board.isEnginePlaying = false;
        }
      } else if (playerTurn === "black") {
        if (player2 === "human" && !board.isEnginePlaying) {
          playTheHumanMove(playedMove);
        } else if (player2 === "engine" || board.isEnginePlaying) {
          playTheEngineMove(playedMove);
          board.isEnginePlaying = false;
        }
      }
    }
  }, [playedMove]);

  useEffect(() => {
    if (board !== null && !isFetchingMove && !isGameOver && !startNewGame) {
      if (playerTurn === "white" && player1 === "engine") {
        getTheEngineMove(engine1);
      } else if (playerTurn === "black" && player2 === "engine") {
        getTheEngineMove(engine2);
      }
    }
  }, [player1, player2, playerTurn]);

  return <></>;
};

export default PlayNow;
