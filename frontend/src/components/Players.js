import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEngine1,
  setEngine2,
  setPlayer1,
  setPlayer2,
} from "../actions/gameActions";
import DropDown from "./DropDown";

const Players = ({ playerOptions, engineOptions }) => {
  const dispatch = useDispatch();

  const { player1, player2 } = useSelector((state) => state.players);
  const { engine1, engine2 } = useSelector((state) => state.engines);

  return (
    <>
      <div className="players">
        <div className="player1">
          <span>Player 1</span>
          <DropDown
            options={playerOptions}
            value={player1}
            onChange={(e) => dispatch(setPlayer1(e.target.value))}
          />
        </div>
        <div className="player2">
          <span>Player 2</span>
          <DropDown
            options={playerOptions}
            value={player2}
            onChange={(e) => dispatch(setPlayer2(e.target.value))}
          />
        </div>
      </div>
      <div className="engines">
        <div className="player1">
          {player1 === "engine" && (
            <DropDown
              options={engineOptions}
              value={engine1}
              onChange={(e) => dispatch(setEngine1(e.target.value))}
            />
          )}
        </div>
        <div className="player2">
          {player2 === "engine" && (
            <DropDown
              options={engineOptions}
              value={engine2}
              onChange={(e) => dispatch(setEngine2(e.target.value))}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Players;
