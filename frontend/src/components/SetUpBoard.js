import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ChessBoard from "./ChessBoard";
import {
  isValidMove,
  markMovableSquares,
  unmarkMovableSquares,
} from "../utils/helper";
import { setIsGameOver, setPlayedMove } from "../actions/gameActions";
import { promote } from "../utils/uniqueMoves";

const SetUpBoard = ({ ranks, files, board, gameSocket, setBoard, setSlug }) => {
  const dispatch = useDispatch();

  const { legalMoves, playerTurn } = useSelector((state) => state.gameDetails);
  const { isGameOver, willPromote, gameResult } = useSelector(
    (state) => state.gameStatus
  );

  const { slug } = useParams();

  useEffect(() => {
    console.log("slug: " + slug);
    setSlug(slug);
  }, [slug]);

  useEffect(() => {
    setBoard(document.querySelector(".chess-board"));

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
        board.classList.add("dragging", "no-animation");
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
        board.classList.remove("no-animation");
      }, 80);
    }

    var square = e.target.id;

    if (isValidMove(board.piece.classList[2], square, legalMoves)) {
      dispatch(setPlayedMove(`${board.piece.classList[2]}${square}`));
    }

    board.classList.remove("dragging", "capturing");
    board.piece.classList.remove("draggable");
  };

  return (
    <>
      <ChessBoard
        ranks={ranks}
        files={files}
        handleMouseDown={handleMouseDown}
      />

      {willPromote && board !== null && (
        <div className={"pop-up-window"}>
          <div
            className={"promotion-piece"}
            style={{
              backgroundImage: `url(/images/pieces/queen-${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={() => {
              promote(null, "queen", board, ranks, slug, gameSocket);
            }}
          />
          <div
            className={"promotion-piece"}
            style={{
              backgroundImage: `url(/images/pieces/rook-${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={() => {
              promote(null, "rook", board, ranks, slug, gameSocket);
            }}
          />
          <div
            className={"promotion-piece"}
            style={{
              backgroundImage: `url(/images/pieces/bishop-${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={() => {
              promote(null, "bishop", board, ranks, slug, gameSocket);
            }}
          />
          <div
            className={"promotion-piece"}
            style={{
              backgroundImage: `url(/images/pieces/knight-${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={() => {
              promote(null, "knight", board, ranks, slug, gameSocket);
            }}
          />
        </div>
      )}

      {isGameOver && (
        <div className={"pop-up-window"}>
          <div>
            {/* The Outcome can be either Checkmate or Draw */}
            {gameResult.outcome === "checkmate"
              ? `${gameResult.winner} has checkmated ${gameResult.loser}!`
              : `Draw by ${gameResult.reason}!`}
            <br /> Game Over!
          </div>
          <div
            className="cross-button"
            onMouseDown={() => {
              dispatch(setIsGameOver(false));
              board.onmouseup = null;
              document.querySelector(".App").classList.remove("inactive");
            }}
          >
            +
          </div>
        </div>
      )}
    </>
  );
};

export default SetUpBoard;
