export const gameDetailsReducer = (
  state = {
    chessBoard: "",
    legalMoves: [],
    playerTurn: "",
    playedMove: "",
  },
  action
) => {
  switch (action.type) {
    case "SET_CHESS_BOARD":
      return {
        ...state,
        chessBoard: action.payload,
      };
    case "SET_LEGAL_MOVES":
      return {
        ...state,
        legalMoves: action.payload,
      };
    case "SET_PLAYER_TURN":
      return {
        ...state,
        playerTurn: action.payload,
      };
    case "SET_PLAYED_MOVE":
      return {
        ...state,
        playedMove: action.payload,
      };
    default:
      return state;
  }
};

export const playersReducer = (
  state = {
    player1: "",
    player2: "",
  },
  action
) => {
  switch (action.type) {
    case "SET_PLAYER_1":
      return {
        ...state,
        player1: action.payload,
      };
    case "SET_PLAYER_2":
      return {
        ...state,
        player2: action.payload,
      };
    default:
      return state;
  }
};

export const enginesReducer = (
  state = {
    engine1: "",
    engine2: "",
  },
  action
) => {
  switch (action.type) {
    case "SET_ENGINE_1":
      return {
        ...state,
        engine1: action.payload,
      };
    case "SET_ENGINE_2":
      return {
        ...state,
        engine2: action.payload,
      };
    default:
      return state;
  }
};

export const gameStatusReducer = (
  state = {
    isGameOver: false,
    willPromote: false,
    gameResult: {},
    startNewGame: false,
  },
  action
) => {
  switch (action.type) {
    case "SET_IS_GAME_OVER":
      return {
        ...state,
        isGameOver: action.payload,
      };
    case "SET_WILL_PROMOTE":
      return {
        ...state,
        willPromote: action.payload,
      };
    case "SET_GAME_RESULT":
      return {
        ...state,
        gameResult: action.payload,
      };
    case "START_NEW_GAME":
      return {
        ...state,
        startNewGame: action.payload,
      };
    default:
      return state;
  }
};
