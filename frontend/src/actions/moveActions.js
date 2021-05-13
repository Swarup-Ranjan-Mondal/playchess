import axios from "axios";
import {
  setGameResult,
  setIsGameOver,
  setLegalMoves,
  setPlayedMove,
} from "./gameActions";

export const getTheEngineMove =
  (engineName, board) => async (dispatch, getState) => {
    board.classList.add("waiting");
    const { gameId } = getState().gameDetails;

    try {
      dispatch({ type: "ENGINE_MOVE_REQUEST" });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/play",
        {
          game_id: gameId,
          play_engine: true,
          engine_name: engineName,
        },
        config
      );

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

      board.isEnginePlaying = true;
      board.move = Object.values(data.engine_move)[0];
      dispatch(setPlayedMove(Object.keys(data.engine_move)[0]));
      dispatch({ type: "ENGINE_MOVE_SUCCESS" });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ENGINE_MOVE_FAILURE",
        payload: error,
      });
    }

    board.classList.remove("waiting");
  };

export const pushTheMove = (board) => async (dispatch, getState) => {
  board.classList.add("waiting");
  const { gameId } = getState().gameDetails;

  try {
    dispatch({ type: "RUN_MOVE_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/play",
      {
        game_id: gameId,
        move: board.move,
      },
      config
    );

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

    dispatch({ type: "RUN_MOVE_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "RUN_MOVE_FAILURE",
      payload: error,
    });
  }

  board.classList.remove("waiting");
};
