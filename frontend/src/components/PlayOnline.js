import React, { useState, useEffect } from "react";

const PlayOnline = ({
  gameSocket,
  board,
  playedMove,
  playTheHumanMove,
  playTheEngineMove,

  setGameSocket,
  setChessBoard,
  setLegalMoves,
  setPlayerTurn,
  setPlayedMove,
  setIsGameOver,
  setGameResult,
}) => {
  const [playOtherPlayerMove, setPlayOtherPlayerMove] = useState(false);

  useEffect(() => {
    if (gameSocket === null) {
      setGameSocket(
        new WebSocket(
          `ws://${window.location.hostname}:${8000}/ws/play/online/`
        )
      );
    } else {
      gameSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);

        if (data.board) {
          setChessBoard(data.board);
          setPlayerTurn("white");
        }
        if (data.move) {
          setPlayOtherPlayerMove(true);
          setPlayedMove(Object.keys(data.move)[0]);
          board.move = Object.values(data.move)[0];
        }
        if (data.is_game_over) {
          if (data.outcome === "checkmate") {
            setGameResult({
              outcome: data.outcome,
              winner: data.winner,
              loser: data.loser,
            });
          } else if (data.outcome === "draw") {
            setGameResult({
              outcome: data.outcome,
              reason: data.reason,
            });
          }
          setIsGameOver(true);
          document.querySelector(".App").classList.add("inactive");
        } else {
          setLegalMoves(data.legal_moves);
        }
      };

      gameSocket.onclose = function () {
        console.error("Chat socket closed unexpectedly");
      };
    }
  }, [gameSocket]);

  useEffect(() => {
    if (playedMove !== "") {
      if (playOtherPlayerMove) {
        setPlayOtherPlayerMove(false);
        playTheEngineMove(playedMove);
        board.classList.remove("waiting");
      } else {
        board.classList.add("waiting");
        playTheHumanMove(playedMove);
      }
    }
  }, [playedMove]);

  return <></>;
};

export default PlayOnline;
