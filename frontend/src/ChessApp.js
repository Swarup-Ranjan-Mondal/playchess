import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import PlayNowScreen from "./screens/PlayNowScreen";
import PlayOnlineScreen from "./screens/PlayOnlineScreen";

function ChessApp() {
  const ranks = 8;
  const files = 8;
  const playerOptions = ["human", "engine"];
  const engineOptions = ["stockfish", "komodo"];

  return (
    <Router>
      <div className="App">
        <Route exact path="/">
          <HomeScreen />
        </Route>
        <Route exact path="/play/now">
          <PlayNowScreen
            ranks={ranks}
            files={files}
            playerOptions={playerOptions}
            engineOptions={engineOptions}
          />
        </Route>
        <Route exact path="/play/online">
          <PlayOnlineScreen ranks={ranks} files={files} />
        </Route>
      </div>
    </Router>
  );
}

export default ChessApp;
