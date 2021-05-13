import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import SetUpBoard from "../components/SetUpBoard";
import ControlSection from "../components/ControlSection";
import GameInfoSection from "../components/GameInfoSection";
import {
  setChessBoard,
  setGameResult,
  setIsGameOver,
  setLegalMoves,
  setPlayedMove,
  setPlayerTurn,
} from "../actions/gameActions";
import { autoPlayTheMove, playTheHumanMove } from "../utils/movement";

const PlayOnlineScreen = ({ ranks, files }) => {
  const dispatch = useDispatch();

  const { playedMove } = useSelector((state) => state.gameDetails);

  const [board, setBoard] = useState(null);
  const [gameSocket, setGameSocket] = useState(null);
  const [slug, setSlug] = useState("");
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
          dispatch(setChessBoard(data.board));
          dispatch(setPlayerTurn("white"));
        }
        if (data.move) {
          setPlayOtherPlayerMove(true);
          dispatch(setPlayedMove(Object.keys(data.move)[0]));
          board.move = Object.values(data.move)[0];
        }
        if (data.is_game_over) {
          if (data.outcome === "checkmate") {
            dispatch(
              setGameResult({
                outcome: data.outcome,
                winner: data.winner,
                loser: data.loser,
              })
            );
          } else if (data.outcome === "draw") {
            dispatch(
              setGameResult({
                outcome: data.outcome,
                reason: data.reason,
              })
            );
          }
          dispatch(setIsGameOver(true));
          document.querySelector(".App").classList.add("inactive");
        } else {
          dispatch(setLegalMoves(data.legal_moves));
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
        autoPlayTheMove(playedMove, board, ranks, slug, gameSocket);
        board.classList.remove("waiting");
      } else {
        board.classList.add("waiting");
        playTheHumanMove(playedMove, board, ranks, slug, gameSocket);
      }
    }
  }, [playedMove]);

  return (
    <>
      <ControlSection show={false} />
      <div className="board-container">
        <Route path="/play/:slug">
          <SetUpBoard
            ranks={ranks}
            files={files}
            board={board}
            gameSocket={gameSocket}
            setBoard={setBoard}
            setSlug={setSlug}
          />
        </Route>
      </div>
      <GameInfoSection />
    </>
  );
};

export default PlayOnlineScreen;
