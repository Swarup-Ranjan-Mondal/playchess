import React from "react";
import ChessPieces from "./ChessPieces";

const ChessBoard = ({
  ranks,
  files,
  chessBoard,
  handleMouseDown,
  imageNameOfPieces,
}) => {
  return (
    <div className="chess_board">
      {[...Array(ranks).keys()].map((rank) => (
        <div className="rank" key={rank.toString()}>
          {[...Array(files).keys()].map((file) => {
            var color = (rank + file) % 2 === 0 ? "light" : "dark";

            return (
              <div
                key={`${rank}${file}`}
                id={`${String.fromCharCode(97 + file)}${ranks - rank}`}
                className={`square ${color}`}
                style={{
                  backgroundImage: `url(images/squares/square_${
                    color[0] + color[color.length - 1]
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

                {rank === 0 && file === 0 && (
                  <ChessPieces
                    ranks={ranks}
                    files={files}
                    chessBoard={chessBoard}
                    handleMouseDown={handleMouseDown}
                    imageNameOfPieces={imageNameOfPieces}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
