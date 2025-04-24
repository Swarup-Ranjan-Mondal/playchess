import store from "../store";
import { setWillPromote } from "../actions/gameActions";
import {
  moveThePiece,
  setTurn,
  showAsCapturedPiece,
  unmarkMovableSquares,
} from "./helper";
import {
  castle,
  enPassant,
  promote,
  isCastlingPossible,
  isEnPassantPossible,
  isPromotionPossible,
} from "./uniqueMoves";

export const playTheHumanMove = async (
  move,
  board,
  ranks,
  files,
  slug,
  gameSocket,
  reverse = false
) => {
  const { legalMoves } = store.getState().gameDetails;
  if (board.lastMove.initialSquare !== undefined) {
    board.lastMove.initialSquare.classList.remove("initial");
    board.lastMove.landingSquare.classList.remove("landing");
  }

  var initialSquare = move.substring(0, 2);
  var landingSquare = move.substring(2, 4);
  var piece = document.querySelector(`.piece.${landingSquare}`);

  if (isPromotionPossible(board.piece, landingSquare)) {
    store.dispatch(setWillPromote(true));
    board.classList.add("inactive");
  } else {
    board.move = legalMoves[`${board.piece.classList[2]}${landingSquare}`];

    if (isCastlingPossible(board.piece, landingSquare)) {
      castle(
        board.piece.classList[1],
        landingSquare.charCodeAt(0) - board.piece.classList[2].charCodeAt(0) ===
          2
          ? "short"
          : "long",
        ranks,
        files,
        reverse
      );
    } else if (isEnPassantPossible(board.piece, landingSquare)) {
      enPassant(board.piece, landingSquare, ranks, files, reverse);
    } else {
      moveThePiece(board.piece, landingSquare, ranks, files, reverse);
      if (piece !== null) {
        piece.classList.replace("piece", "captured_piece");
        showAsCapturedPiece(piece);
      }
    }

    unmarkMovableSquares(board);
    board.lastMove.initialSquare = document.querySelector(
      `#${initialSquare}.square`
    );
    board.lastMove.landingSquare = document.querySelector(
      `#${landingSquare}.square`
    );
    board.lastMove.initialSquare.classList.add("initial");
    board.lastMove.landingSquare.classList.add("landing");
    gameSocket.send(
      JSON.stringify({
        move,
      })
    );
    setTurn(board);
    board.piece = undefined;
  }
};

export const autoPlayTheMove = (
  move,
  board,
  ranks,
  files,
  slug,
  gameSocket,
  reverse = false
) => {
  unmarkMovableSquares(board);
  if (board.lastMove.initialSquare !== undefined) {
    board.lastMove.initialSquare.classList.remove("initial");
    board.lastMove.landingSquare.classList.remove("landing");
  }

  const initialPostion = move.substring(0, 2);
  const finalPostion = move.substring(2, 4);
  const pieceToBeMoved = document.querySelector(`.piece.${initialPostion}`);
  const pieceToBeCaptured = document.querySelector(`.piece.${finalPostion}`);

  if (isCastlingPossible(pieceToBeMoved, finalPostion)) {
    castle(
      pieceToBeMoved.classList[1],
      finalPostion.charCodeAt(0) - pieceToBeMoved.classList[2].charCodeAt(0) ===
        2
        ? "short"
        : "long",
      ranks,
      files,
      reverse
    );
  } else if (isEnPassantPossible(pieceToBeMoved, finalPostion)) {
    enPassant(pieceToBeMoved, finalPostion, ranks, files, reverse);
  } else if (isPromotionPossible(pieceToBeMoved, finalPostion)) {
    promote(
      pieceToBeMoved,
      move.charAt(4) === "q"
        ? "queen"
        : move.charAt(4) === "r"
        ? "rook"
        : move.charAt(4) === "b"
        ? "bishop"
        : "knight",
      board,
      ranks,
      files,
      slug,
      gameSocket,
      reverse
    );
  } else {
    moveThePiece(pieceToBeMoved, finalPostion, ranks, files, reverse);
  }

  if (pieceToBeCaptured !== null) {
    pieceToBeCaptured.classList.replace("piece", "captured_piece");
    showAsCapturedPiece(pieceToBeCaptured);
  }

  board.lastMove.initialSquare = document.querySelector(
    `#${initialPostion}.square`
  );
  board.lastMove.landingSquare = document.querySelector(
    `#${finalPostion}.square`
  );
  board.lastMove.initialSquare.classList.add("initial");
  board.lastMove.landingSquare.classList.add("landing");

  setTurn(board);
  board.piece = undefined;
};
