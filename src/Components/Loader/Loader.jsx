import React from "react";
import "./Loader.scss";
export default function Loader({ isFull, color='#DDEDD1' }) {
  return (
    <div
    style={{'--loader-color':color}}
      className={`${
        isFull
          ? "absolute justify-center items-center top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-999 h-screen flex"
          : ""
      } `}
    >
      <div className="atom-spinner ">
        <div className="spinner-inner">
          <div className="spinner-line"></div>
          <div className="spinner-line"></div>
          <div className="spinner-line"></div>
          <div className="spinner-circle">&#9679;</div>
        </div>
      </div>
    </div>
  );
}
