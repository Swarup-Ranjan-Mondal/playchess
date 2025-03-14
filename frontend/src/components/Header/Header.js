import React from "react";
import "./Header.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { MdMenu, MdClose, MdArrowBack } from "react-icons/md";

const Header = ({ showSidebar, setShowSidebar }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <header>
      {location.pathname !== "/" && (
        <button onClick={() => history.push("/")} className="back-button">
          <MdArrowBack />
        </button>
      )}
      {showSidebar !== undefined && setShowSidebar !== undefined && (
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {!showSidebar ? <MdMenu /> : <MdClose />}
        </button>
      )}

      <Link to="/" title="Play Chess">
        Play Chess
      </Link>
    </header>
  );
};

export default Header;
