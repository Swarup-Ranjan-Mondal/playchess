import { moveThePiece } from "./helper";

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

export const castle = (color, type, ranks) => {
  if (color === "white" || color === "black") {
    var king = document.getElementById(`${color === "white" ? "K" : "k"}`);
    var rank = color === "white" ? 1 : 8;

    if (type === "short") {
      let rook = document.getElementById(`${color === "white" ? "R2" : "r2"}`);
      moveThePiece(king, `g${rank}`, ranks);
      moveThePiece(rook, `f${rank}`, ranks);
    } else if (type === "long") {
      let rook = document.getElementById(`${color === "white" ? "R1" : "r1"}`);
      moveThePiece(king, `c${rank}`, ranks);
      moveThePiece(rook, `d${rank}`, ranks);
    }
  }
};

export const enPassant = (piece, squareId, ranks) => {
  var pawnNo = squareId.charCodeAt(0) - 97 + 1;
  var pawnToBeCaptured = document.getElementById(
    `${piece.id.includes("P") ? "p" : "P"}${pawnNo}`
  );

  moveThePiece(piece, squareId, ranks);
  pawnToBeCaptured.parentNode.removeChild(pawnToBeCaptured);
};

// temporary function
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
