import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  enginesReducer,
  gameDetailsReducer,
  playersReducer,
  gameStatusReducer,
} from "./reducers/gameReducers";

const reducer = combineReducers({
  gameDetails: gameDetailsReducer,
  players: playersReducer,
  engines: enginesReducer,
  gameStatus: gameStatusReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
