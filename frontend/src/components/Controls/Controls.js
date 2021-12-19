import React from "react";
import "./Controls.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setEngine1,
  setEngine2,
  setPlayer1,
  setPlayer2,
  setStartNewGame,
} from "../../actions/gameActions";
import DropDown from "../DropDown/DropDown";

const Controls = ({ engineOptions }) => {
  const playerOptions = ["human", "engine"];

  const dispatch = useDispatch();

  const { player1, player2 } = useSelector((state) => state.players);
  const { engine1, engine2 } = useSelector((state) => state.engines);
  const { startNewGame } = useSelector((state) => state.gameStatus);

  return (
    <div className="controls">
      <div className="players">
        <div className="player1">
          <span>Player 1</span>
          <DropDown
            value={player1}
            options={playerOptions}
            onChange={(e) => dispatch(setPlayer1(e.target.value))}
          />
          {player1 === "engine" && (
            <DropDown
              value={engine1}
              options={engineOptions}
              onChange={(e) => dispatch(setEngine1(e.target.value))}
            />
          )}
        </div>

        <div className="player2">
          <span>Player 2</span>
          <DropDown
            value={player2}
            options={playerOptions}
            onChange={(e) => dispatch(setPlayer2(e.target.value))}
          />
          {player2 === "engine" && (
            <DropDown
              value={engine2}
              options={engineOptions}
              onChange={(e) => dispatch(setEngine2(e.target.value))}
            />
          )}
        </div>
      </div>

      <div className="button-belt">
        <button
          title="New Game"
          id="new-game-button"
          className="btn btn-primary"
          onClick={() => dispatch(setStartNewGame(true))}
          disabled={startNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Controls;
