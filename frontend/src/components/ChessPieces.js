import React from "react";
import { imageNameOfPieces } from "../utils/helper";

const ChessPieces = ({ chessBoard, ranks, files, handleMouseDown }) => {
  const getAnIdOfPiece = (pieceSymbol, file) => {
    return pieceSymbol.toLowerCase() === "p"
      ? `${pieceSymbol}${file + 1}`
      : pieceSymbol.toLowerCase() !== "k" && pieceSymbol.toLowerCase() !== "q"
      ? `${pieceSymbol}${Math.floor((2 * file) / files) + 1}`
      : pieceSymbol;
  };

  return (
    <>
      {chessBoard.split("\n").map((rank, i) =>
        rank.split(" ").map(
          (pieceSymbol, j) =>
            pieceSymbol !== "." && (
              <div
                key={getAnIdOfPiece(pieceSymbol, j)}
                className={`piece ${
                  pieceSymbol.toUpperCase() === pieceSymbol ? "white" : "black"
                } ${String.fromCharCode(97 + j)}${ranks - i}`}
                id={getAnIdOfPiece(pieceSymbol, j)}
                style={{
                  backgroundImage: `url(/images/pieces/${imageNameOfPieces[pieceSymbol]}.svg)`,
                  top: `${i * 100}%`,
                  right: `-${j * 100}%`,
                  bottom: `-${i * 100}%`,
                  left: `${j * 100}%`,
                }}
                onMouseDown={handleMouseDown}
              ></div>
            )
        )
      )}
    </>
  );
};

export default ChessPieces;
