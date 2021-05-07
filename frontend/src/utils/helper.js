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

export const updateMoveHistory = (board, playerTurn) => {
  const movesGrid = document.querySelector(".moves_grid");

  if (playerTurn === "white") {
    board.moveNo += 1;
    const moveNo = document.createElement("div");
    moveNo.classList.add("move_no");
    moveNo.innerText = board.moveNo;
    movesGrid.appendChild(moveNo);

    const whiteMove = document.createElement("div");
    whiteMove.classList.add("move_white");
    whiteMove.innerText = board.move;
    movesGrid.appendChild(whiteMove);
  } else if (playerTurn === "black") {
    const blackMove = document.createElement("div");
    blackMove.classList.add("move_black");
    blackMove.innerText = board.move;
    movesGrid.appendChild(blackMove);
  }

  const moveHistory = document.querySelector(".move_history");
  moveHistory.scrollTop = moveHistory.scrollHeight;
};
