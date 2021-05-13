import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Players from "./Players";
import { setStartNewGame } from "../actions/gameActions";

const ControlSection = ({ show, playerOptions, engineOptions }) => {
  const dispatch = useDispatch();

  const { startNewGame } = useSelector((state) => state.gameStatus);

  return (
    <section className="control-section">
      {show && (
        <>
          <Players
            playerOptions={playerOptions}
            engineOptions={engineOptions}
          />
          <div className="button-belt">
            <button
              id="new-game-button"
              className="btn btn-primary"
              onClick={(e) => dispatch(setStartNewGame(true))}
              disabled={startNewGame}
            >
              New Game
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ControlSection;
