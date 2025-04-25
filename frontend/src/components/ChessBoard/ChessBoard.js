import React, { useRef } from "react";
import "./ChessBoard.css";
import { useSelector } from "react-redux";
import ChessPiece from "../ChessPiece/ChessPiece";
import { unmarkMovableSquares } from "../../utils/helper";

const getSquareId = (rank, file, ranks, files, reverse) => {
  const col = String.fromCharCode(97 + (!reverse ? file : files - file - 1));
  const row = !reverse ? ranks - rank : rank + 1;
  return `${col}${row}`;
};

const getNotation = (rank, file, ranks, files, reverse) => {
  const alphabet =
    rank === ranks - 1
      ? String.fromCharCode(97 + (!reverse ? file : files - file - 1))
      : null;
  const number = file === 0 ? (!reverse ? ranks - rank : rank + 1) : null;

  return { alphabet, number };
};

const renderChessPieces = (
  chessBoard,
  ranks,
  files,
  handleMouseDown,
  reverse
) => {
  if (!chessBoard) return null;

  return chessBoard
    .split("\n")
    .map((rank, i) =>
      rank
        .split(" ")
        .map(
          (pieceSymbol, j) =>
            pieceSymbol !== "." && (
              <ChessPiece
                key={`piece-${String.fromCharCode(97 + j)}${ranks - i}`}
                pieceSymbol={pieceSymbol}
                rank={ranks - i}
                file={j + 1}
                ranks={ranks}
                files={files}
                handleMouseDown={handleMouseDown}
                reverse={reverse}
              />
            )
        )
    );
};

const ChessBoard = ({
  board,
  playerTurn,
  ranks,
  files,
  handleMouseDown,
  reverse = false,
}) => {
  let { chessBoard } = useSelector((state) => state.gameDetails);

  if (reverse) {
    chessBoard = chessBoard
      .split("\n")
      .reverse()
      .map((row) => row.split(" ").reverse().join(" "))
      .join("\n");
  }

  const squareRefs = useRef(
    [...Array(ranks * files)].map(() => React.createRef())
  );

  return (
    <div className="board-container">
      <div className="chess-board">
        {[...Array(ranks).keys()].map((rank) =>
          [...Array(files).keys()].map((file) => {
            const color = (rank + file) % 2 === 0 ? "light" : "dark";
            const squareId = getSquareId(rank, file, ranks, files, reverse);
            const { alphabet, number } = getNotation(
              rank,
              file,
              ranks,
              files,
              reverse
            );
            const backgroundImage = `/images/squares/square-${
              color[0] + color[color.length - 1]
            }.png`;
            const squareIndex = rank * files + file;

            const handleMouseDownOnSquare = (e) => {
              const squareElement = squareRefs?.current[squareIndex]?.current;
              if (!squareElement) return;

              const isPiece = e.target.classList.contains("piece");
              const isPlayerPiece = e.target.classList.contains(playerTurn);
              const isMovable = squareElement.classList.contains("movable");

              if ((!isPiece || !isPlayerPiece) && !isMovable) {
                unmarkMovableSquares(board);
              }
            };

            return (
              <div
                key={`${rank}${file}`}
                id={squareId}
                className={`square ${color}`}
                style={{ backgroundImage: `url(${backgroundImage})` }}
                ref={squareRefs.current[squareIndex]}
                onMouseDown={handleMouseDownOnSquare}
              >
                {alphabet && (
                  <div className="notation alphabet">{alphabet}</div>
                )}
                {number && <div className="notation number">{number}</div>}
                {rank === 0 &&
                  file === 0 &&
                  renderChessPieces(
                    chessBoard,
                    ranks,
                    files,
                    handleMouseDown,
                    reverse
                  )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
