import React, { useMemo, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./ChessApp.css";

import HomeScreen from "./screens/HomeScreen/HomeScreen";
import PlayNowScreen from "./screens/PlayNowScreen/PlayNowScreen";
import PlayOnlineScreen from "./screens/PlayOnlineScreen/PlayOnlineScreen";

// Constants
const ranks = 8;
const files = 8;
const engineOptions = ["stockfish", "komodo"];

// Resize Logic
const handleResize = (element) => {
  const root = document.documentElement;
  const chessApp = document.querySelector(".chess-app");
  const orientation =
    element.width / element.height < 900 / 654 ? "portrait" : "landscape";
  const edgeLength =
    element.width <= element.height
      ? element.width * 0.935
      : orientation === "portrait"
      ? element.width * 0.8
      : element.height * 0.85;

  chessApp.classList.remove("portrait", "landscape");
  chessApp.classList.add(orientation);

  root.style.setProperty("--board-width", Math.floor(edgeLength) + "px");
  root.style.setProperty("--board-height", Math.floor(edgeLength) + "px");
};

const createResizeObserver = () => {
  return new ResizeObserver((entries) => {
    handleResize(entries[0].contentRect);
  });
};

const ChessApp = () => {
  const resizeObserver = useMemo(() => createResizeObserver(), []);
  const appRef = useRef(null);

  // Initial resize on mount
  useEffect(() => {
    if (appRef.current) {
      const rect = appRef.current.getBoundingClientRect();
      handleResize(rect);
      resizeObserver.observe(appRef.current);
    }

    return () => {
      if (appRef.current) resizeObserver.unobserve(appRef.current);
    };
  }, [resizeObserver]);

  return (
    <Router>
      <div className="chess-app" ref={appRef}>
        <Switch>
          <Route exact path="/">
            <HomeScreen resizeObserver={resizeObserver} />
          </Route>

          <Route exact path="/play-now">
            <PlayNowScreen
              ranks={ranks}
              files={files}
              engineOptions={engineOptions}
              resizeObserver={resizeObserver}
            />
          </Route>

          <Route exact path="/play-online">
            <PlayOnlineScreen
              ranks={ranks}
              files={files}
              resizeObserver={resizeObserver}
            />
          </Route>

          <Redirect from="*" to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default ChessApp;
