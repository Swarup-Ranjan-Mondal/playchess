import React from "react";
import "./Card3D.css";

const Card3D = ({ cardTitle, cardImgLocation, cardColor }) => {
  return (
    <div
      title={cardTitle}
      className="card-3d"
      style={{
        backgroundColor: cardColor,
      }}
    >
      <img src={cardImgLocation} alt={cardTitle} />
      <span>{cardTitle}</span>
    </div>
  );
};

export default Card3D;
