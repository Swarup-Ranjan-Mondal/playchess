import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlayer1,
  setPlayer2,
  setChessBoard,
  setGameResult,
  setIsGameOver,
  setLegalMoves,
  setPlayedMove,
  setPlayerTurn,
  resetGame,
} from "../../actions/gameActions";
import { autoPlayTheMove, playTheHumanMove } from "../../utils/movement";
import Header from "../../components/Header/Header";
import GameZone from "../../components/GameZone/GameZone";
import PopupWindow from "../../components/PopupWindow/PopupWindow";

const PlayOnlineScreen = ({ ranks, files, resizeObserver }) => {
  const dispatch = useDispatch();

  const { playedMove } = useSelector((state) => state.gameDetails);

  const [board, setBoard] = useState(null);
  const [gameSocket, setGameSocket] = useState(null);
  const [slug, setSlug] = useState("");
  const [playOtherPlayerMove, setPlayOtherPlayerMove] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState("");

  useEffect(() => {
    dispatch(setPlayer1("human"));
    dispatch(setPlayer2("human"));

    document.title = "Play Chess - Play Online";
    resizeObserver.observe(document.querySelector(".content"));

    return () => {
      dispatch(resetGame());
    };
  }, []);

  useEffect(() => {
    if (gameSocket === null) {
      setGameSocket(
        new WebSocket(
          `ws://${window.location.hostname}:${8000}/ws/play/online/`
        )
      );
    } else {
      gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.board) {
          dispatch(setChessBoard(data.board));
          dispatch(setPlayerTurn("white"));
        }
        if (data.legal_moves) {
          dispatch(setLegalMoves(data.legal_moves));
        }
        if (data.waiting_message) {
          setWaitingMessage(data.waiting_message);
        } else if (data.player_connected) {
          setWaitingMessage("");
        }
        if (data.disconnection_message) {
          gameSocket.close(1000);
          dispatch(setLegalMoves([]));
          dispatch(setIsGameOver(true));
          dispatch(
            setGameResult({
              outcome: "none",
              reason: data.disconnection_message,
            })
          );
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
          gameSocket.close(1000);
          dispatch(setLegalMoves([]));
          dispatch(setIsGameOver(true));
        }

        board.classList.remove("waiting");
      };

      return () => {
        gameSocket.close(1000);
      };
    }
  }, [gameSocket]);

  useEffect(() => {
    if (playedMove !== "") {
      if (playOtherPlayerMove) {
        setPlayOtherPlayerMove(false);
        autoPlayTheMove(playedMove, board, ranks, slug, gameSocket);
      } else {
        board.classList.add("waiting");
        playTheHumanMove(playedMove, board, ranks, slug, gameSocket);
      }
    }
  }, [playedMove]);

  return (
    <>
      <Header />

      <main className="content">
        <Route path="/play/:slug">
          <GameZone
            ranks={ranks}
            files={files}
            board={board}
            setSlug={setSlug}
            setBoard={setBoard}
            gameSocket={gameSocket}
          />

          {waitingMessage !== "" && (
            <PopupWindow noCross={true}>{waitingMessage}</PopupWindow>
          )}
        </Route>
      </main>
    </>
  );
};

export default PlayOnlineScreen;
