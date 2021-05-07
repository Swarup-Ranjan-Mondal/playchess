import React from "react";
import SetUpBoard from "./SetUpBoard";

const ChessBoard = ({
  player1,
  player2,
  engine1,
  engine2,
  startNewGame,
  setStartNewGame,
  imageNameOfPieces,
}) => {
  const ranks = 8;
  const files = 8;

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
                  <SetUpBoard
                    ranks={ranks}
                    files={files}
                    player1={player1}
                    player2={player2}
                    engine1={engine1}
                    engine2={engine2}
                    startNewGame={startNewGame}
                    setStartNewGame={setStartNewGame}
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
