import React from "react";
import "./ChessBoard.css";
import { useSelector } from "react-redux";
import ChessPiece from "../ChessPiece/ChessPiece";

const ChessBoard = ({ ranks, files, handleMouseDown, reverse = false }) => {
  let { chessBoard } = useSelector((state) => state.gameDetails);

  if (reverse) {
    chessBoard = chessBoard
      .split("\n")
      .reverse()
      .map((row) => row.split(" ").reverse().join(" "))
      .join("\n");
  }

  return (
    <div className="board-container">
      <div className="chess-board">
        {[...Array(ranks).keys()].map((rank) =>
          [...Array(files).keys()].map((file) => {
            let color = (rank + file) % 2 === 0 ? "light" : "dark";
            let length = color.length;

            return (
              <div
                key={`${rank}${file}`}
                id={`${String.fromCharCode(
                  97 + (!reverse ? file : files - file - 1)
                )}${!reverse ? ranks - rank : rank + 1}`}
                className={`square ${color}`}
                style={{
                  backgroundImage: `url(/images/squares/square-${
                    color[0] + color[length - 1]
                  }.png)`,
                }}
              >
                {rank === ranks - 1 && (
                  <div className="notation alphabet">
                    {`${String.fromCharCode(
                      97 + (!reverse ? file : files - file - 1)
                    )}`}
                  </div>
                )}

                {file === 0 && (
                  <div className="notation number">{`${
                    !reverse ? ranks - rank : rank + 1
                  }`}</div>
                )}

                {rank === 0 &&
                  file === 0 &&
                  chessBoard !== "" &&
                  chessBoard
                    .split("\n")
                    .map((rank, i) =>
                      rank
                        .split(" ")
                        .map(
                          (pieceSymbol, j) =>
                            pieceSymbol !== "." && (
                              <ChessPiece
                                key={`piece-${String.fromCharCode(97 + j)}${
                                  ranks - i
                                }`}
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
