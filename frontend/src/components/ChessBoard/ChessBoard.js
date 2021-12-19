import React, { useEffect } from "react";
import "./ChessBoard.css";
import { useSelector } from "react-redux";
import ChessPiece from "../ChessPiece/ChessPiece";

const ChessBoard = ({ ranks, files, handleMouseDown }) => {
  const { chessBoard } = useSelector((state) => state.gameDetails);

  useEffect(() => {}, [chessBoard]);

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
                id={`${String.fromCharCode(97 + file)}${ranks - rank}`}
                className={`square ${color}`}
                style={{
                  backgroundImage: `url(/images/squares/square-${
                    color[0] + color[length - 1]
                  }.png)`,
                }}
              >
                {rank === ranks - 1 && (
                  <div className="notation alphabet">
                    {`${String.fromCharCode(97 + file)}`}
                  </div>
                )}

                {file === 0 && (
                  <div className="notation number">{`${ranks - rank}`}</div>
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
