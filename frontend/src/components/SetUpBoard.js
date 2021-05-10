import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ChessBoard from "./ChessBoard";
import {
  isValidMove,
  markMovableSquares,
  unmarkMovableSquares,
} from "../utils/helper";
import BoardUtils from "./BoardUtils";

const SetUpBoard = ({
  ranks,
  files,
  player1,
  player2,
  engine1,
  engine2,
  startNewGame,
  setStartNewGame,
  imageNameOfPieces,
}) => {
  const { slug } = useParams();

  const [board, setBoard] = useState(null);
  const [gameId, setGameId] = useState("");
  const [chessBoard, setChessBoard] = useState("");
  const [legalMoves, setLegalMoves] = useState({});
  const [playerTurn, setPlayerTurn] = useState("");
  const [playedMove, setPlayedMove] = useState("");

  useEffect(() => {
    setBoard(document.querySelector(".chess_board"));

    if (board !== null) {
      board.moveNo = 0;
      board.lastMove = {};
      board.isEnginePlaying = false;
    }
  }, [board]);

  const handleMouseDown = (e) => {
    if (e.target.classList[1] === playerTurn) {
      if (
        board.piece === undefined ||
        board.piece.classList[1] === e.target.classList[1]
      ) {
        unmarkMovableSquares(board);
        board.piece = e.target;
        board.piece.classList.add("draggable");
        board.classList.add("dragging", "no_animation");
        markMovableSquares(board.piece, legalMoves, board);

        board.dragging = {};
        board.dragging.box = board.piece.getBoundingClientRect();
        board.dragging.origin = {
          x: e.clientX,
          y: e.clientY,
        };

        board.dragging.offset = {
          x:
            board.dragging.origin.x -
            (board.dragging.box.left + board.dragging.box.width / 2),
          y:
            board.dragging.origin.y -
            (board.dragging.box.top + board.dragging.box.height / 2),
        };

        board.onmouseup = handleMouseUp;
        board.onmousemove = handleMouseMove;
      }
    } else if (
      board.piece !== undefined &&
      isValidMove(board.piece.classList[2], e.target.classList[2], legalMoves)
    ) {
      board.classList.add("capturing");
    } else {
      board.onmouseup = null;
    }
  };

  const handleMouseMove = (e) => {
    board.piece.style.transform = `translate(${
      e.clientX - board.dragging.origin.x + board.dragging.offset.x
    }px, ${e.clientY - board.dragging.origin.y + board.dragging.offset.y}px)`;
  };

  const handleMouseUp = (e) => {
    board.onmousemove = null;
    board.piece.style.transform = "translate(0px, 0px)";

    if (board.classList.contains("dragging")) {
      if (board.dragging.timeout) {
        clearTimeout(board.dragging.timeout);
      }
      board.dragging.timeout = setTimeout(() => {
        board.classList.remove("no_animation");
      }, 80);
    }

    var square = e.target.id;

    if (isValidMove(board.piece.classList[2], square, legalMoves)) {
      setPlayedMove(`${board.piece.classList[2]}${square}`);
    }

    board.classList.remove("dragging", "capturing");
    board.piece.classList.remove("draggable");
  };

  return (
    <>
      <ChessBoard
        ranks={ranks}
        files={files}
        chessBoard={chessBoard}
        player1={player1}
        player2={player2}
        engine1={engine1}
        engine2={engine2}
        startNewGame={startNewGame}
        setStartNewGame={setStartNewGame}
        handleMouseDown={handleMouseDown}
        imageNameOfPieces={imageNameOfPieces}
      />

      <BoardUtils
        board={board}
        ranks={ranks}
        gameId={gameId}
        legalMoves={legalMoves}
        playerTurn={playerTurn}
        playedMove={playedMove}
        player1={player1}
        player2={player2}
        engine1={engine1}
        engine2={engine2}
        startNewGame={startNewGame}
        setChessBoard={setChessBoard}
        setGameId={setGameId}
        setLegalMoves={setLegalMoves}
        setPlayerTurn={setPlayerTurn}
        setPlayedMove={setPlayedMove}
        setStartNewGame={setStartNewGame}
        imageNameOfPieces={imageNameOfPieces}
        slug={slug}
      />
    </>
  );
};

export default SetUpBoard;
