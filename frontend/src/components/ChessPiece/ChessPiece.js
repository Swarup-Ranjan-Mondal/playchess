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
  reverse = false,
}) => {
  const getPieceId = (pieceSymbol, file) => {
    return pieceSymbol.toLowerCase() === "p"
      ? `${pieceSymbol}${!reverse ? file : files - file + 1}`
      : pieceSymbol.toLowerCase() !== "k" && pieceSymbol.toLowerCase() !== "q"
      ? `${pieceSymbol}${
          !reverse
            ? Math.ceil((2 * file) / files)
            : 3 - Math.ceil((2 * file) / files)
        }`
      : pieceSymbol;
  };

  return (
    <div
      id={getPieceId(pieceSymbol, file)}
      className={`piece ${
        pieceSymbol.toUpperCase() === pieceSymbol ? "white" : "black"
      } ${String.fromCharCode(97 + (!reverse ? file - 1 : files - file))}${
        !reverse ? rank : ranks - rank + 1
      }`}
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
