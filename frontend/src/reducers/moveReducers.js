export const engineMoveReducer = (state = {}, action) => {
  switch (action.type) {
    case "ENGINE_MOVE_REQUEST":
      return { isFetchingMove: true };
    case "ENGINE_MOVE_SUCCESS":
      return { isFetchingMove: false };
    case "ENGINE_MOVE_FAILURE":
      return {
        isFetchingMove: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const pushMoveReducer = (state = {}, action) => {
  switch (action.type) {
    case "RUN_MOVE_REQUEST":
      return { isPushingMove: true };
    case "RUN_MOVE_SUCCESS":
      return { isPushingMove: false };
    case "RUN_MOVE_FAILURE":
      return {
        isPushingMove: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
