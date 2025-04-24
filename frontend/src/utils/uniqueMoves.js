import store from "../store";
import { setWillPromote } from "../actions/gameActions";
import {
  moveThePiece,
  setTurn,
  showAsCapturedPiece,
  unmarkMovableSquares,
} from "./helper";

export const isCastlingPossible = (piece, squareId) => {
  var squareOfPiece = piece.classList[2];

  if (squareOfPiece.charCodeAt(1) === squareId.charCodeAt(1)) {
    if (Math.abs(squareId.charCodeAt(0) - squareOfPiece.charCodeAt(0)) === 2) {
      if (piece.id === "K" && squareOfPiece === "e1") {
        return true;
      } else if (piece.id === "k" && squareOfPiece === "e8") {
        return true;
      }
    }
  }

  return false;
};

export const isEnPassantPossible = (piece, squareId) => {
  var squareOfPiece = piece.classList[2];
  var pawnNo = squareId.charCodeAt(0) - 97 + 1;

  if (document.querySelector(`.piece.${squareId}`) !== null) {
    // If piece is present on the landing square then EnPassant not possible.
    return false;
  }

  if (Math.abs(squareId.charCodeAt(0) - squareOfPiece.charCodeAt(0)) === 1) {
    if (
      piece.id.includes("P") &&
      squareOfPiece.charAt(1) === "5" &&
      squareId.charCodeAt(1) - squareOfPiece.charCodeAt(1) === 1
    ) {
      let pawnToBeCaptured = document.getElementById(`p${pawnNo}`);

      if (pawnToBeCaptured !== null && pawnToBeCaptured.classList.length >= 3) {
        if (
          pawnToBeCaptured.classList[2].charAt(1) === squareOfPiece.charAt(1)
        ) {
          return true;
        }
      }
    } else if (
      piece.id.includes("p") &&
      squareOfPiece.charAt(1) === "4" &&
      squareId.charCodeAt(1) - squareOfPiece.charCodeAt(1) === -1
    ) {
      let pawnToBeCaptured = document.getElementById(`P${pawnNo}`);

      if (pawnToBeCaptured !== null && pawnToBeCaptured.classList.length >= 3) {
        if (
          pawnToBeCaptured.classList[2].charAt(1) === squareOfPiece.charAt(1)
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isPromotionPossible = (piece, squareId) => {
  if (piece.id.includes("P") && squareId.charAt(1) === "8") {
    return true;
  } else if (piece.id.includes("p") && squareId.charAt(1) === "1") {
    return true;
  }

  return false;
};

export const castle = (color, type, ranks, files, reverse = false) => {
  if (color === "white" || color === "black") {
    const king = document.getElementById(`${color === "white" ? "K" : "k"}`);
    const rank = color === "white" ? 1 : 8;

    if (type === "short") {
      const rook = document.getElementById(
        `${color === "white" ? "R2" : "r2"}`
      );
      moveThePiece(king, `g${rank}`, ranks, files, reverse);
      moveThePiece(rook, `f${rank}`, ranks, files, reverse);
    } else if (type === "long") {
      const rook = document.getElementById(
        `${color === "white" ? "R1" : "r1"}`
      );
      moveThePiece(king, `c${rank}`, ranks, files, reverse);
      moveThePiece(rook, `d${rank}`, ranks, files, reverse);
    }
  }
};

export const enPassant = (piece, squareId, ranks, files, reverse = false) => {
  var pawnNo = squareId.charCodeAt(0) - 97 + 1;
  var pawnToBeCaptured = document.getElementById(
    `${piece.id.includes("P") ? "p" : "P"}${pawnNo}`
  );

  moveThePiece(piece, squareId, ranks, files, reverse);
  pawnToBeCaptured.parentNode.removeChild(pawnToBeCaptured);
};

export const promote = (
  piece,
  promoteTo,
  board,
  ranks,
  files,
  slug,
  gameSocket,
  reverse = false
) => {
  const { legalMoves, playedMove, playerTurn } = store.getState().gameDetails;

  board.onmouseup = null;
  const promotionSquare = playedMove.substring(2, 4);
  const pieceToBeCaptured = document.querySelector(`.piece.${promotionSquare}`);
  var humanMove = false;

  if (piece === null) {
    piece = board.piece;
    humanMove = true;
  }

  const initialSquare = piece.classList[2];
  board.classList.add("inactive");
  store.dispatch(setWillPromote(false));
  moveThePiece(piece, promotionSquare, ranks, files, reverse);

  if (humanMove === true && pieceToBeCaptured !== null) {
    pieceToBeCaptured.classList.replace("piece", "captured_piece");
    showAsCapturedPiece(pieceToBeCaptured);
  }

  var promotionPieceSymbol,
    pieceNo = 1;

  if (promoteTo === "queen") {
    promotionPieceSymbol = playerTurn === "white" ? "Q" : "q";
  } else if (promoteTo === "rook") {
    promotionPieceSymbol = playerTurn === "white" ? "R" : "r";
  } else if (promoteTo === "bishop") {
    promotionPieceSymbol = playerTurn === "white" ? "B" : "b";
  } else if (promoteTo === "knight") {
    promotionPieceSymbol = playerTurn === "white" ? "N" : "n";
  }

  document.querySelectorAll(`.piece.${playerTurn}`).forEach((piece) => {
    if (piece.id.includes(promotionPieceSymbol)) {
      if (piece.id.length === 1) {
        piece.id = piece.id.concat(`${pieceNo}`);
      }
      pieceNo++;
    }
  });

  piece.id = `${promotionPieceSymbol}${pieceNo === 1 ? "" : pieceNo}`;
  piece.classList.replace(piece.classList[2], promotionSquare);
  piece.style.backgroundImage = `url(/images/pieces/${promoteTo}-${
    playerTurn === "white" ? "lt" : "dk"
  }.svg)`;

  if (humanMove) {
    const promotionMove = `${initialSquare}${promotionSquare}${promotionPieceSymbol.toLowerCase()}`;
    board.move = legalMoves[promotionMove];
    console.log(promotionMove, board.move);

    unmarkMovableSquares(board);
    board.lastMove.initialSquare = document.querySelector(
      `#${initialSquare}.square`
    );
    board.lastMove.landingSquare = document.querySelector(
      `#${promotionSquare}.square`
    );
    board.lastMove.initialSquare.classList.add("initial");
    board.lastMove.landingSquare.classList.add("landing");
    setTurn(board);
    board.piece = undefined;
    gameSocket.send(
      JSON.stringify({
        move: promotionMove,
      })
    );
  }

  board.classList.remove("inactive");
};

// temporary function
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
