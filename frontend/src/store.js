import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  enginesReducer,
  gameDetailsReducer,
  playersReducer,
  gameStatusReducer,
} from "./reducers/gameReducers";
import { engineMoveReducer, pushMoveReducer } from "./reducers/moveReducers";

const reducer = combineReducers({
  gameDetails: gameDetailsReducer,
  players: playersReducer,
  engines: enginesReducer,
  gameStatus: gameStatusReducer,
  engineMove: engineMoveReducer,
  pushMove: pushMoveReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
