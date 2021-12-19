import React from "react";
import "./UserRow.css";

const UserRow = ({ userName, top, bottom }) => {
  return (
    <div className={`user-row ${top ? "top" : bottom ? "bottom" : ""}`}>
      <i className="status"></i>
      <span>{userName}</span>
    </div>
  );
};

export default UserRow;
