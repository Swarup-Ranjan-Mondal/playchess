import React, { useEffect } from "react";
import "./GameZone.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  isValidMove,
  markMovableSquares,
  toToggleCase,
  unmarkMovableSquares,
} from "../../utils/helper";
import { setIsGameOver, setPlayedMove } from "../../actions/gameActions";
import { promote } from "../../utils/uniqueMoves";
import ChessBoard from "../ChessBoard/ChessBoard";
import PopupWindow from "../PopupWindow/PopupWindow";
import CapturedPiecesRow from "../CapturedPiecesRow/CapturedPiecesRow";
import MoveHistory from "../MoveHistory/MoveHistory";
import UserRow from "../UserRow/UserRow";

const GameZone = ({ ranks, files, board, gameSocket, setBoard, setSlug, reverse = true }) => {
  const dispatch = useDispatch();

  const { player1, player2 } = useSelector((state) => state.players);
  const { engine1, engine2 } = useSelector((state) => state.engines);
  const { legalMoves, playerTurn } = useSelector((state) => state.gameDetails);
  const { isGameOver, willPromote, gameResult } = useSelector(
    (state) => state.gameStatus
  );

  const { slug } = useParams();

  useEffect(() => {
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

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const handleMouseDown = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      e.clientX = e.changedTouches[0].clientX;
      e.clientY = e.changedTouches[0].clientY;

      document
        .querySelector(".content")
        .addEventListener("touchmove", preventDefault, { passive: false });
    }

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
        board.ontouchend = handleMouseUp;
        board.onmousemove = handleMouseMove;
        board.ontouchmove = handleMouseMove;
      }
    } else if (
      board.piece !== undefined &&
      isValidMove(board.piece.classList[2], e.target.classList[2], legalMoves)
    ) {
      board.classList.add("capturing");
    } else {
      board.onmouseup = null;
      board.ontouchend = null;
    }
  };

  const handleMouseMove = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      e.clientX = e.changedTouches[0].clientX;
      e.clientY = e.changedTouches[0].clientY;
    }

    board.piece.style.transform = `translate(${
      e.clientX - board.dragging.origin.x + board.dragging.offset.x
    }px, ${e.clientY - board.dragging.origin.y + board.dragging.offset.y}px)`;
  };

  const handleMouseUp = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      e.square = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );

      document
        .querySelector(".content")
        .removeEventListener("touchmove", preventDefault, { passive: false });
    }

    board.onmousemove = null;
    board.ontouchmove = null;
    board.piece.style.transform = "translate(0px, 0px)";

    if (board.classList.contains("dragging")) {
      if (board.dragging.timeout) {
        clearTimeout(board.dragging.timeout);
      }
      board.dragging.timeout = setTimeout(() => {
        board.classList.remove("no-animation");
      }, 80);
    }

    var square = e.square ? e.square.id : e.target.id;

    if (isValidMove(board.piece.classList[2], square, legalMoves)) {
      dispatch(setPlayedMove(`${board.piece.classList[2]}${square}`));
    }

    board.classList.remove("dragging", "capturing");
    board.piece.classList.remove("draggable");
  };

  return (
    <>
      <div className="container">
        <ChessBoard
          board={board}
          playerTurn={playerTurn}
          ranks={ranks}
          files={files}
          handleMouseDown={handleMouseDown}
          reverse={reverse}
        />

        <CapturedPiecesRow playerSide="black" />

        <UserRow
          userName={
            player2 === "human"
              ? `Player${player1 === "human" ? "2" : ""}`
              : `Engine${player1 === "engine" ? "2" : ""} (${
                  engine2 === "stockfish"
                    ? "Stockfish 13"
                    : engine2 === "komodo"
                    ? "Komodo 12"
                    : ""
                })`
          }
          top={true}
        />

        <MoveHistory />

        <UserRow
          userName={
            player1 === "human"
              ? `Player${player2 === "human" ? "1" : ""}`
              : `Engine${player2 === "engine" ? "1" : ""} (${
                  engine1 === "stockfish"
                    ? "Stockfish 13"
                    : engine1 === "komodo"
                    ? "Komodo 12"
                    : ""
                })`
          }
          bottom={true}
        />

        <CapturedPiecesRow playerSide="white" />
      </div>

      {willPromote && board !== null && (
        <PopupWindow noCross={true}>
          {["queen", "rook", "bishop", "knight"].map((pieceName) => (
            <div
              className="promotion-piece"
              style={{
                backgroundImage: `url(/images/pieces/${pieceName}-${
                  playerTurn === "white" ? "lt" : "dk"
                }.svg)`,
              }}
              onMouseDown={() => {
                promote(null, pieceName, board, ranks, files, slug, gameSocket, reverse);
              }}
            />
          ))}
        </PopupWindow>
      )}

      {isGameOver && (
        <PopupWindow
          onClose={() => {
            dispatch(setIsGameOver(false));
            board.onmouseup = null;
            board.ontouchend = null;
          }}
        >
          {/* The Outcome can be Abandonedment, Checkmate or Draw */}
          {gameResult.outcome === "none"
            ? gameResult.reason
            : gameResult.outcome === "checkmate"
            ? `${toToggleCase(gameResult.winner)} has checkmated ${toToggleCase(
                gameResult.loser
              )}!`
            : gameResult.outcome === "draw"
            ? `Draw by ${gameResult.reason}!`
            : ""}
          <br /> Game Over!
        </PopupWindow>
      )}
    </>
  );
};

export default GameZone;
