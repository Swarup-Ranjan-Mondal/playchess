export const setChessBoard = (chessBoard) => {
  return {
    type: "SET_CHESS_BOARD",
    payload: chessBoard,
  };
};

export const setLegalMoves = (legalMoves) => {
  return {
    type: "SET_LEGAL_MOVES",
    payload: legalMoves,
  };
};

export const setPlayerTurn = (playerTurn) => {
  return {
    type: "SET_PLAYER_TURN",
    payload: playerTurn,
  };
};

export const setPlayedMove = (playedMove) => {
  return {
    type: "SET_PLAYED_MOVE",
    payload: playedMove,
  };
};

export const setReverseBoard = (reverseBoard) => {
  return {
    type: "REVERSE_BOARD",
    payload: reverseBoard,
  };
};

export const setPlayer1 = (player1) => {
  return {
    type: "SET_PLAYER_1",
    payload: player1,
  };
};

export const setPlayer2 = (player2) => {
  return {
    type: "SET_PLAYER_2",
    payload: player2,
  };
};

export const setEngine1 = (engine1) => {
  return {
    type: "SET_ENGINE_1",
    payload: engine1,
  };
};

export const setEngine2 = (engine2) => {
  return {
    type: "SET_ENGINE_2",
    payload: engine2,
  };
};

export const setIsGameOver = (isGameOver) => {
  return {
    type: "SET_IS_GAME_OVER",
    payload: isGameOver,
  };
};

export const setWillPromote = (willPromote) => {
  return {
    type: "SET_WILL_PROMOTE",
    payload: willPromote,
  };
};

export const setGameResult = (gameResult) => {
  return {
    type: "SET_GAME_RESULT",
    payload: gameResult,
  };
};

export const setStartNewGame = (startNewGame) => {
  return {
    type: "START_NEW_GAME",
    payload: startNewGame,
  };
};

export const resetGame = () => (dispatch, getState) => {
  dispatch(setChessBoard(""));
  dispatch(setLegalMoves([]));
  dispatch(setPlayerTurn(""));
  dispatch(setPlayedMove(""));

  dispatch(setPlayer1(""));
  dispatch(setPlayer2(""));

  dispatch(setEngine1(""));
  dispatch(setEngine2(""));

  dispatch(setGameResult({}));
  dispatch(setIsGameOver(false));
  dispatch(setWillPromote(false));
  dispatch(setStartNewGame(false));
};
