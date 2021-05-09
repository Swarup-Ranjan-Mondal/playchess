import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  moveThePiece,
  unmarkMovableSquares,
  updateMoveHistory,
} from "../utils/helper";
import {
  isCastlingPossible,
  isEnPassantPossible,
  isPromotionPossible,
  castle,
  enPassant,
} from "../utils/unique_moves";

const BoardUtils = ({
  board,
  ranks,
  gameId,
  legalMoves,
  playerTurn,
  playedMove,
  player1,
  player2,
  engine1,
  engine2,
  startNewGame,
  setChessBoard,
  setLegalMoves,
  setPlayerTurn,
  setPlayedMove,
  setStartNewGame,
  imageNameOfPieces,
}) => {
  const [willPromote, setWillPromote] = useState(false);
  const [isFetchingMove, setIsFetchingMove] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState({});

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

      setChessBoard("");
      setLegalMoves(data.legal_moves);
      setChessBoard(data.board);
      document.querySelector(".moves_grid").innerHTML = "";
      board.isEnginePlaying = false;

      ["white", "black"].forEach((color) => {
        ["P", "B", "N", "R", "Q"].forEach((pieceSymbol) => {
          const capturedPiecesGroup = document.querySelector(
            `.captured_pieces_row.${color} .captured_pieces_group.${pieceSymbol}`
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

      setStartNewGame(false);
      setPlayerTurn("white");

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
          playTheHumanMove(playedMove);
        } else if (player1 === "engine" || board.isEnginePlaying) {
          playTheEngineMove(playedMove);
          board.isEnginePlaying = false;
        }
      } else if (playerTurn === "black") {
        if (player2 === "human" && !board.isEnginePlaying) {
          playTheHumanMove(playedMove);
        } else if (player2 === "engine" || board.isEnginePlaying) {
          playTheEngineMove(playedMove);
          board.isEnginePlaying = false;
        }
      }
    }
  }, [playedMove]);

  useEffect(() => {
    if (board !== null && !isFetchingMove && !isGameOver && !startNewGame) {
      if (playerTurn === "white" && player1 === "engine") {
        getTheEngineMove(engine1);
      } else if (playerTurn === "black" && player2 === "engine") {
        getTheEngineMove(engine2);
      }
    }
  }, [player1, player2, playerTurn]);

  const playTheHumanMove = async (move) => {
    if (board.lastMove.initialSquare !== undefined) {
      board.lastMove.initialSquare.classList.remove("initial");
      board.lastMove.landingSquare.classList.remove("landing");
    }

    var initialSquare = move.substring(0, 2);
    var landingSquare = move.substring(2, 4);
    var piece = document.querySelector(`.piece.${landingSquare}`);

    if (isPromotionPossible(board.piece, landingSquare)) {
      setWillPromote(true);
      board.classList.add("inactive");
    } else {
      board.move = legalMoves[`${board.piece.classList[2]}${landingSquare}`];

      if (isCastlingPossible(board.piece, landingSquare)) {
        castle(
          board.piece.classList[1],
          landingSquare.charCodeAt(0) -
            board.piece.classList[2].charCodeAt(0) ===
            2
            ? "short"
            : "long",
          ranks
        );
      } else if (isEnPassantPossible(board.piece, landingSquare)) {
        enPassant(board.piece, landingSquare, ranks);
      } else {
        moveThePiece(board.piece, landingSquare, ranks);
        if (piece !== null) {
          piece.classList.replace("piece", "captured_piece");
          showAsCapturedPiece(piece);
        }
      }

      unmarkMovableSquares(board);
      board.lastMove.initialSquare = document.querySelector(
        `#${initialSquare}.square`
      );
      board.lastMove.landingSquare = document.querySelector(
        `#${landingSquare}.square`
      );
      board.lastMove.initialSquare.classList.add("initial");
      board.lastMove.landingSquare.classList.add("landing");
      runTheMove();
      setTurn();
      board.piece = undefined;
    }
  };

  const playTheEngineMove = (move) => {
    unmarkMovableSquares(board);
    if (board.lastMove.initialSquare !== undefined) {
      board.lastMove.initialSquare.classList.remove("initial");
      board.lastMove.landingSquare.classList.remove("landing");
    }

    const initialPostion = move.substring(0, 2);
    const finalPostion = move.substring(2, 4);
    const pieceToBeMoved = document.querySelector(`.piece.${initialPostion}`);
    const pieceToBeCaptured = document.querySelector(`.piece.${finalPostion}`);

    if (isCastlingPossible(pieceToBeMoved, finalPostion)) {
      castle(
        pieceToBeMoved.classList[1],
        finalPostion.charCodeAt(0) -
          pieceToBeMoved.classList[2].charCodeAt(0) ===
          2
          ? "short"
          : "long",
        ranks
      );
    } else if (isEnPassantPossible(pieceToBeMoved, finalPostion)) {
      enPassant(pieceToBeMoved, finalPostion, ranks);
    } else if (isPromotionPossible(pieceToBeMoved, finalPostion)) {
      promote(
        pieceToBeMoved,
        move.charAt(4) === "q"
          ? "queen"
          : move.charAt(4) === "r"
          ? "rook"
          : move.charAt(4) === "b"
          ? "bishop"
          : "knight",
        finalPostion
      );
    } else {
      moveThePiece(pieceToBeMoved, finalPostion, ranks);
    }

    if (pieceToBeCaptured !== null) {
      pieceToBeCaptured.classList.replace("piece", "captured_piece");
      showAsCapturedPiece(pieceToBeCaptured);
    }

    board.lastMove.initialSquare = document.querySelector(
      `#${initialPostion}.square`
    );
    board.lastMove.landingSquare = document.querySelector(
      `#${finalPostion}.square`
    );
    board.lastMove.initialSquare.classList.add("initial");
    board.lastMove.landingSquare.classList.add("landing");

    setTurn();
  };

  const setTurn = () => {
    updateMoveHistory(board, playerTurn);
    setPlayerTurn((turn) => (turn === "white" ? "black" : "white"));
  };

  const runTheMove = async () => {
    board.classList.add("waiting");

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
        setGameResult({
          outcome: data.outcome,
          winner: data.winner,
          loser: data.loser,
        });
      } else if (data.outcome === "draw") {
        setGameResult({
          outcome: data.outcome,
          reason: data.reason,
        });
      }
      setIsGameOver(true);
      document.querySelector(".App").classList.add("inactive");
    } else {
      setLegalMoves(data.legal_moves);
    }

    board.classList.remove("waiting");
  };

  const getTheEngineMove = async (engineName) => {
    board.classList.add("waiting");
    setIsFetchingMove(true);
    // board.isFetching = true;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
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
          setGameResult({
            outcome: data.outcome,
            winner: data.winner,
            loser: data.loser,
          });
        } else if (data.outcome === "draw") {
          setGameResult({
            outcome: data.outcome,
            reason: data.reason,
          });
        }
        setIsGameOver(true);
        document.querySelector(".App").classList.add("inactive");
      } else {
        setLegalMoves(data.legal_moves);
      }

      board.isEnginePlaying = true;
      board.move = Object.values(data.engine_move)[0];
      setPlayedMove(Object.keys(data.engine_move)[0]);
    } catch (err) {
      console.log(err);
    }

    setIsFetchingMove(false);
    board.classList.remove("waiting");
  };

  const promote = (piece, promoteTo) => {
    board.onmouseup = null;
    var promotionSquare = playedMove.substring(2, 4);
    var pieceToBeCaptured = document.querySelector(`.piece.${promotionSquare}`);
    var humanMove = false;

    if (piece === null) {
      piece = board.piece;
      humanMove = true;
    }

    const initialSquare = piece.classList[2];
    board.classList.add("inactive");
    setWillPromote(false);
    moveThePiece(piece, promotionSquare, ranks);

    if (humanMove === true && pieceToBeCaptured !== null) {
      pieceToBeCaptured.classList.replace("piece", "captured_piece");
      showAsCapturedPiece(pieceToBeCaptured);
    }

    var promotionPieceSymbol,
      pieceNo = 1;

    if (promoteTo === "queen") {
      promotionPieceSymbol = playerTurn === "white" ? "Q" : "q";
    } else if (promoteTo === "rook") {
      promotionPieceSymbol = playerTurn === "white" ? "R" : "r";
    } else if (promoteTo === "bishop") {
      promotionPieceSymbol = playerTurn === "white" ? "B" : "b";
    } else if (promoteTo === "knight") {
      promotionPieceSymbol = playerTurn === "white" ? "N" : "n";
    }

    document.querySelectorAll(`.piece.${playerTurn}`).forEach((piece) => {
      if (piece.id.includes(promotionPieceSymbol)) {
        if (piece.id.length === 1) {
          piece.id = piece.id.concat(`${pieceNo}`);
        }
        pieceNo++;
      }
    });

    piece.id = `${promotionPieceSymbol}${pieceNo === 1 ? "" : pieceNo}`;
    piece.classList.replace(piece.classList[2], promotionSquare);
    piece.style.backgroundImage = `url(images/pieces/${promoteTo}_${
      playerTurn === "white" ? "lt" : "dk"
    }.svg)`;

    if (humanMove) {
      board.move =
        legalMoves[
          `${initialSquare}${promotionSquare}${promotionPieceSymbol.toLowerCase()}`
        ];

      unmarkMovableSquares(board);
      board.lastMove.initialSquare = document.querySelector(
        `#${initialSquare}.square`
      );
      board.lastMove.landingSquare = document.querySelector(
        `#${promotionSquare}.square`
      );
      board.lastMove.initialSquare.classList.add("initial");
      board.lastMove.landingSquare.classList.add("landing");
      setTurn();
      board.piece = undefined;
      runTheMove();
    }

    board.classList.remove("inactive");
  };

  const showAsCapturedPiece = (capturedPiece) => {
    const capturedPiecesGroup = document.querySelector(
      `.captured_pieces_row.${playerTurn} .captured_pieces_group.${capturedPiece.id[0].toUpperCase()}`
    );
    capturedPiecesGroup.style.paddingLeft = "1.2rem";

    const capturedPieceToBeShown = document.createElement("div");
    capturedPieceToBeShown.classList.add("new_captured_piece");
    capturedPieceToBeShown.style.backgroundImage = `url(images/pieces/${
      imageNameOfPieces[capturedPiece.id[0]]
    }.svg)`;
    capturedPieceToBeShown.style.marginLeft = "-1.2rem";
    capturedPiecesGroup.append(capturedPieceToBeShown);
  };

  return (
    <>
      {willPromote && board !== null && (
        <div className={"pop_up_window"}>
          <div
            className={"promotion_piece"}
            style={{
              backgroundImage: `url(images/pieces/queen_${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={(e) => {
              promote(null, "queen");
            }}
          />
          <div
            className={"promotion_piece"}
            style={{
              backgroundImage: `url(images/pieces/rook_${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={(e) => {
              promote(null, "rook");
            }}
          />
          <div
            className={"promotion_piece"}
            style={{
              backgroundImage: `url(images/pieces/bishop_${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={(e) => {
              promote(null, "bishop");
            }}
          />
          <div
            className={"promotion_piece"}
            style={{
              backgroundImage: `url(images/pieces/knight_${
                playerTurn === "white" ? "lt" : "dk"
              }.svg)`,
            }}
            onMouseDown={(e) => {
              promote(null, "knight");
            }}
          />
        </div>
      )}

      {isGameOver && (
        <div className={"pop_up_window"}>
          <div>
            {/* The Outcome can be either Checkmate or Draw */}
            {gameResult.outcome === "checkmate"
              ? `${gameResult.winner} has checkmated ${gameResult.loser}!`
              : `Draw by ${gameResult.reason}!`}
            <br /> Game Over!
          </div>
          <div
            className="cross_button"
            onMouseDown={(e) => {
              setIsGameOver(false);
              board.onmouseup = null;
              document.querySelector(".App").classList.remove("inactive");
            }}
          >
            +
          </div>
        </div>
      )}
    </>
  );
};

export default BoardUtils;
