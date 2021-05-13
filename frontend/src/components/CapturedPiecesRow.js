import React from "react";

const CapturedPiecesRow = ({ playerSide }) => {
  return (
    <div className={`captured-pieces-row ${playerSide}`}>
      <div className="captured-pieces-group P"></div>
      <div className="captured-pieces-group B"></div>
      <div className="captured-pieces-group N"></div>
      <div className="captured-pieces-group R"></div>
      <div className="captured-pieces-group Q"></div>
    </div>
  );
};

export default CapturedPiecesRow;
