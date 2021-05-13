import React, { useState, useEffect } from "react";
import { Route } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import SetUpBoard from "../components/SetUpBoard";
import ControlSection from "../components/ControlSection";
import GameInfoSection from "../components/GameInfoSection";
import {
  setChessBoard,
  setGameId,
  setLegalMoves,
  setPlayerTurn,
  setStartNewGame,
} from "../actions/gameActions";
import { getTheEngineMove } from "../actions/moveActions";
import { autoPlayTheMove, playTheHumanMove } from "../utils/movement";

const PlayNowScreen = ({ ranks, files, playerOptions, engineOptions }) => {
  const dispatch = useDispatch();

  const { gameId, playerTurn, playedMove } = useSelector(
    (state) => state.gameDetails
  );
  const { player1, player2 } = useSelector((state) => state.players);
  const { engine1, engine2 } = useSelector((state) => state.engines);
  const { isGameOver, startNewGame } = useSelector((state) => state.gameStatus);
  const { isFetchingMove } = useSelector((state) => state.engineMove);

  const [board, setBoard] = useState(null);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const { data } = await axios.get("/api/play");

        dispatch(setGameId(data.game_id));
        dispatch(setChessBoard(data.board));
        dispatch(setLegalMoves(data.legal_moves));
        dispatch(setPlayerTurn("white"));
      } catch (err) {
        console.log(err);
      }
    };

    fetchBoardDetails();
  }, []);

  useEffect(() => {
    const setNewGame = async () => {
      board.classList.add("waiting");

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/new-game",
        {
          game_id: gameId,
        },
        config
      );

      dispatch(setChessBoard(""));
      dispatch(setLegalMoves(data.legal_moves));
      dispatch(setChessBoard(data.board));
      document.querySelector(".moves-grid").innerHTML = "";
      board.isEnginePlaying = false;

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

      dispatch(setStartNewGame(false));
      dispatch(setPlayerTurn("white"));

      board.classList.remove("waiting");
    };

    if (startNewGame && !isFetchingMove) {
      setNewGame();
    }
  }, [startNewGame, isFetchingMove]);

  useEffect(() => {
    if (playedMove !== "") {
      // Considering player1 plays with white pieces and player2 plays with black pieces
      if (playerTurn === "white") {
        if (player1 === "human" && !board.isEnginePlaying) {
          playTheHumanMove(playedMove, board, ranks, slug, null);
        } else if (player1 === "engine" || board.isEnginePlaying) {
          autoPlayTheMove(playedMove, board, ranks, slug, null);
          board.isEnginePlaying = false;
        }
      } else if (playerTurn === "black") {
        if (player2 === "human" && !board.isEnginePlaying) {
          playTheHumanMove(playedMove, board, ranks, slug, null);
        } else if (player2 === "engine" || board.isEnginePlaying) {
          autoPlayTheMove(playedMove, board, ranks, slug, null);
          board.isEnginePlaying = false;
        }
      }
    }
  }, [playedMove]);

  useEffect(() => {
    if (board !== null && !isFetchingMove && !isGameOver && !startNewGame) {
      if (playerTurn === "white" && player1 === "engine") {
        dispatch(getTheEngineMove(engine1, board));
      } else if (playerTurn === "black" && player2 === "engine") {
        dispatch(getTheEngineMove(engine2, board));
      }
    }
  }, [player1, player2, playerTurn]);

  return (
    <>
      <ControlSection
        show={true}
        playerOptions={playerOptions}
        engineOptions={engineOptions}
      />
      <div className="board-container">
        <Route path="/play/:slug">
          <SetUpBoard
            ranks={ranks}
            files={files}
            board={board}
            setBoard={setBoard}
            setSlug={setSlug}
          />
        </Route>
      </div>
      <GameInfoSection />
    </>
  );
};

export default PlayNowScreen;
