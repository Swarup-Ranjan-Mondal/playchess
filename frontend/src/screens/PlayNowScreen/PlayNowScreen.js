import React, { useState, useEffect } from "react";
import { Route } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlayer1,
  setPlayer2,
  setEngine1,
  setEngine2,
  setChessBoard,
  setLegalMoves,
  setPlayedMove,
  setPlayerTurn,
  setGameResult,
  setIsGameOver,
  setStartNewGame,
  resetGame,
} from "../../actions/gameActions";
import { autoPlayTheMove, playTheHumanMove } from "../../utils/movement";
import Header from "../../components/Header/Header";
import Sidenav from "../../components/Sidenav/Sidenav";
import Controls from "../../components/Controls/Controls";
import GameZone from "../../components/GameZone/GameZone";

const PlayNowScreen = ({ ranks, files, engineOptions, resizeObserver }) => {
  const dispatch = useDispatch();

  const { playerTurn, playedMove } = useSelector((state) => state.gameDetails);
  const { player1, player2 } = useSelector((state) => state.players);
  const { engine1, engine2 } = useSelector((state) => state.engines);
  const { isGameOver, startNewGame } = useSelector((state) => state.gameStatus);

  const [board, setBoard] = useState(null);
  const [gameSocket, setGameSocket] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    dispatch(setPlayer1("human"));
    dispatch(setPlayer2("engine"));

    if (engineOptions.length > 0) {
      dispatch(setEngine1(engineOptions[0]));
      dispatch(setEngine2(engineOptions[0]));
    }

    document.title = "Play Chess - Play Now";
    resizeObserver.observe(document.querySelector(".content"));

    return () => {
      dispatch(resetGame());
    };
  }, []);

  useEffect(() => {
    const setNewGame = async () => {
      board.classList.add("waiting");

      gameSocket.close(1000);
      setGameSocket(null);

      board.isEnginePlaying = false;
      document.querySelector(".moves-grid").innerHTML = "";

      ["white", "black"].forEach((color) => {
        ["P", "B", "N", "R", "Q"].forEach((pieceSymbol) => {
          const capturedPiecesGroup = document.querySelector(
            `.captured-pieces-row.${color} .captured-pieces-group.${pieceSymbol}`
          );
          capturedPiecesGroup.innerHTML = "";
          capturedPiecesGroup.style.paddingLeft = "0rem";
        });
      });

      board.moveNo = 0;
      if (board.lastMove.initialSquare !== undefined) {
        board.lastMove.initialSquare.classList.remove("initial");
        board.lastMove.landingSquare.classList.remove("landing");
      }
      board.lastMove = {};

      dispatch(setPlayedMove(""));
      dispatch(setGameResult({}));
      dispatch(setStartNewGame(false));
    };

    if (startNewGame) {
      setNewGame();
    }
  }, [startNewGame]);

  useEffect(() => {
    if (gameSocket === null) {
      setGameSocket(
        new WebSocket(`ws://${window.location.hostname}:${8000}/ws/play-now/`)
      );
    } else {
      gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.board) {
          dispatch(setChessBoard(""));
          dispatch(setChessBoard(data.board));
          dispatch(setPlayerTurn("white"));
        }
        if (data.legal_moves) {
          dispatch(setLegalMoves(data.legal_moves));
        }
        if (data.engine_move) {
          board.isEnginePlaying = true;
          board.move = Object.values(data.engine_move)[0];
          dispatch(setPlayedMove(Object.keys(data.engine_move)[0]));
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
      // Considering player1 plays with white pieces and player2 plays with black pieces
      if (playerTurn === "white") {
        if (player1 === "human" && !board.isEnginePlaying) {
          board.classList.add("waiting");
          playTheHumanMove(playedMove, board, ranks, slug, gameSocket);
        } else if (player1 === "engine" || board.isEnginePlaying) {
          autoPlayTheMove(playedMove, board, ranks, slug, gameSocket);
          board.isEnginePlaying = false;
        }
      } else if (playerTurn === "black") {
        if (player2 === "human" && !board.isEnginePlaying) {
          board.classList.add("waiting");
          playTheHumanMove(playedMove, board, ranks, slug, gameSocket);
        } else if (player2 === "engine" || board.isEnginePlaying) {
          autoPlayTheMove(playedMove, board, ranks, slug, gameSocket);
          board.isEnginePlaying = false;
        }
      }
    }
  }, [playedMove]);

  useEffect(() => {
    if (board !== null && !isGameOver && !startNewGame) {
      if (playerTurn === "white" && player1 === "engine") {
        board.classList.add("waiting");
        gameSocket.send(
          JSON.stringify({
            play_engine: true,
            engine_name: engine1,
          })
        );
      } else if (playerTurn === "black" && player2 === "engine") {
        board.classList.add("waiting");
        gameSocket.send(
          JSON.stringify({
            play_engine: true,
            engine_name: engine2,
          })
        );
      }
    }
  }, [player1, player2, playerTurn]);

  return (
    <>
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      <Sidenav showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
        <Controls engineOptions={engineOptions} />
      </Sidenav>

      <main className="content">
        <Route path="/:slug">
          <GameZone
            ranks={ranks}
            files={files}
            board={board}
            setSlug={setSlug}
            setBoard={setBoard}
            gameSocket={gameSocket}
          />
        </Route>
      </main>
    </>
  );
};

export default PlayNowScreen;
