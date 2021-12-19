import React from "react";
import "./PopupWindow.css";

const PopupWindow = ({ children, noCross, onClose }) => {
  return (
    <div className="popup-window-background">
      <dialog
        className="popup-window"
        style={{
          padding: !noCross ? "15px 25px 10px 10px" : "15px",
        }}
      >
        {!noCross && (
          <div className="cross-button" onMouseDown={onClose}>
            +
          </div>
        )}
        {children}
      </dialog>
    </div>
  );
};

export default PopupWindow;
