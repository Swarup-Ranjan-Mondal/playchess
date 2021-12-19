import React, { useEffect, useState } from "react";
import "./Sidenav.css";

const Sidenav = ({ children, showSidebar, setShowSidebar }) => {
  const [isHandset, setIsHandset] = useState(false);

  useEffect(() => {
    let resizeObserver = new ResizeObserver((entries) => {
      let handsetBreakpoint = 1002;
      let element = entries[0].contentRect;

      if (element.width < handsetBreakpoint) {
        setIsHandset(true);
      } else {
        setIsHandset(false);
        setShowSidebar(false);
      }
    });

    resizeObserver.observe(document.querySelector(".chess-app"));
  }, []);

  return (
    <>
      {isHandset && showSidebar && (
        <div
          className="side-drawer-background"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <aside
        className={`sidenav ${
          isHandset ? `side-drawer${showSidebar ? " show" : ""}` : "sidebar"
        }`}
      >
        {children}
      </aside>
    </>
  );
};

export default Sidenav;
