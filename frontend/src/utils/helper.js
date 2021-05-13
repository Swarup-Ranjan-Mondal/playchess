import { setPlayerTurn } from "../actions/gameActions";
import store from "../store";

export const imageNameOfPieces = {
  B: "bishop-lt",
  K: "king-lt",
  N: "knight-lt",
  P: "pawn-lt",
  Q: "queen-lt",
  R: "rook-lt",
  b: "bishop-dk",
  k: "king-dk",
  n: "knight-dk",
  p: "pawn-dk",
  q: "queen-dk",
  r: "rook-dk",
};

export const moveThePiece = (piece, squareId, ranks) => {
  if (squareId !== "") {
    var i = ranks - Number(squareId.charAt(1));
    var j = squareId.charCodeAt(0) - 97;

    piece.style.top = `${i * 100}%`;
    piece.style.right = `-${j * 100}%`;
    piece.style.bottom = `-${i * 100}%`;
    piece.style.left = `${j * 100}%`;
    piece.classList.replace(piece.classList[2], squareId);
  }
};

export const isValidMove = (initialPosition, finalPosition, legalMoves) => {
  const move = `${initialPosition}${finalPosition}`;
  var isMoveValid = false;

  Object.keys(legalMoves).forEach((legalMove) => {
    if (legalMove.includes(move)) {
      return (isMoveValid = true);
    }
  });

  return isMoveValid;
};

export const markMovableSquares = (piece, legalMoves, board) => {
  board.movableSquares = [];

  Object.keys(legalMoves).forEach((legalMove) => {
    if (legalMove.includes(piece.classList[2])) {
      const square = document.querySelector(
        `#${legalMove.substring(2, 4)}.square`
      );

      square.classList.add("movable");
      board.movableSquares.push(square);
    }
  });
};

export const unmarkMovableSquares = (board) => {
  if (board.movableSquares !== undefined) {
    board.movableSquares.forEach((square) => {
      square.classList.remove("movable");
    });
  }
};

export const setTurn = (board) => {
  const { playerTurn } = store.getState().gameDetails;
  updateMoveHistory(board, playerTurn);
  store.dispatch(setPlayerTurn(playerTurn === "white" ? "black" : "white"));
};

export const updateMoveHistory = (board) => {
  const { playerTurn } = store.getState().gameDetails;
  const movesGrid = document.querySelector(".moves-grid");

  if (playerTurn === "white") {
    board.moveNo += 1;
    const moveNo = document.createElement("div");
    moveNo.classList.add("move-no");
    moveNo.innerText = board.moveNo;
    movesGrid.appendChild(moveNo);

    const whiteMove = document.createElement("div");
    whiteMove.classList.add("move-white");
    whiteMove.innerText = board.move;
    movesGrid.appendChild(whiteMove);
  } else if (playerTurn === "black") {
    const blackMove = document.createElement("div");
    blackMove.classList.add("move-black");
    blackMove.innerText = board.move;
    movesGrid.appendChild(blackMove);
  }

  const moveHistory = document.querySelector(".move-history");
  moveHistory.scrollTop = moveHistory.scrollHeight;
};

export const showAsCapturedPiece = (capturedPiece) => {
  const { playerTurn } = store.getState().gameDetails;

  const capturedPiecesGroup = document.querySelector(
    `.captured-pieces-row.${playerTurn} .captured-pieces-group.${capturedPiece.id[0].toUpperCase()}`
  );
  capturedPiecesGroup.style.paddingLeft = "1.2rem";

  const capturedPieceToBeShown = document.createElement("div");
  capturedPieceToBeShown.classList.add("new-captured-piece");
  capturedPieceToBeShown.style.backgroundImage = `url(/images/pieces/${
    imageNameOfPieces[capturedPiece.id[0]]
  }.svg)`;
  capturedPieceToBeShown.style.marginLeft = "-1.2rem";
  capturedPiecesGroup.append(capturedPieceToBeShown);
};
