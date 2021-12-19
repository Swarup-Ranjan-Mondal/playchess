import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";

const Header = ({ showSidebar, setShowSidebar }) => {
  return (
    <header>
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
