import React from "react";
import "./ChessPiece.css";
import { imageNameOfPieces } from "../../utils/helper";

const getPieceId = (pieceSymbol, file, files, reverse) => {
  if (pieceSymbol.toLowerCase() === "p") {
    return `${pieceSymbol}${!reverse ? file : files - file + 1}`;
  }

  if (
    pieceSymbol.toLowerCase() !== "k" &&
    pieceSymbol.toLowerCase() !== "q"
  ) {
    return `${pieceSymbol}${
      !reverse
        ? Math.ceil((2 * file) / files)
        : 3 - Math.ceil((2 * file) / files)
    }`;
  }

  return pieceSymbol;
};

const getPieceClass = (pieceSymbol, file, rank, files, ranks, reverse) => {
  const colorClass =
    pieceSymbol.toUpperCase() === pieceSymbol ? "white" : "black";
  const col = String.fromCharCode(
    97 + (!reverse ? file - 1 : files - file)
  );
  const row = !reverse ? rank : ranks - rank + 1;
  return `piece ${colorClass} ${col}${row}`;
};

const getPieceStyle = (pieceSymbol, rank, file, ranks) => {
  return {
    backgroundImage: `url(/images/pieces/${imageNameOfPieces[pieceSymbol]}.svg)`,
    top: `${(ranks - rank) * 100}%`,
    right: `-${(file - 1) * 100}%`,
    bottom: `-${(ranks - rank) * 100}%`,
    left: `${(file - 1) * 100}%`,
  };
};

const ChessPiece = ({
  pieceSymbol,
  rank,
  file,
  ranks,
  files,
  handleMouseDown,
  reverse = false,
}) => {
  const id = getPieceId(pieceSymbol, file, files, reverse);
  const className = getPieceClass(pieceSymbol, file, rank, files, ranks, reverse);
  const style = getPieceStyle(pieceSymbol, rank, file, ranks);

  return (
    <div
      id={id}
      className={className}
      style={style}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    ></div>
  );
};

export default ChessPiece;
