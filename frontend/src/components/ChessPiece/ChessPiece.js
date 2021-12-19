import React from "react";
import "./ChessPiece.css";
import { imageNameOfPieces } from "../../utils/helper";

const ChessPiece = ({
  pieceSymbol,
  rank,
  file,
  ranks,
  files,
  handleMouseDown,
}) => {
  const getPieceId = (pieceSymbol, file) => {
    return pieceSymbol.toLowerCase() === "p"
      ? `${pieceSymbol}${file}`
      : pieceSymbol.toLowerCase() !== "k" && pieceSymbol.toLowerCase() !== "q"
      ? `${pieceSymbol}${Math.ceil((2 * file) / files)}`
      : pieceSymbol;
  };

  return (
    <div
      id={getPieceId(pieceSymbol, file)}
      className={`piece ${
        pieceSymbol.toUpperCase() === pieceSymbol ? "white" : "black"
      } ${String.fromCharCode(97 + (file - 1))}${rank}`}
      style={{
        backgroundImage: `url(/images/pieces/${imageNameOfPieces[pieceSymbol]}.svg)`,
        top: `${(ranks - rank) * 100}%`,
        right: `-${(file - 1) * 100}%`,
        bottom: `-${(ranks - rank) * 100}%`,
        left: `${(file - 1) * 100}%`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    ></div>
  );
};

export default ChessPiece;
