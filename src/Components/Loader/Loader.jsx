import React from "react";
import "./Loader.scss";
export default function Loader({
  isFull,
  color = "var(--bg)",
  isNotActiveUser = false,
}) {
  return (
    <div
      style={{ "--loader-color": color }}
      className={`${
        isFull
          ? "absolute justify-center items-center top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[var(--bg-modal)]/50 z-999 h-screen flex"
          : ""
      } ${isNotActiveUser && "isNotActiveUser flex-col gap-[30px]"} `}
    >
      {isNotActiveUser && (
        <p className="text-[var(--bg)] text-[18px] max-w-[500px] text-center w-[90%]">
          Ваш аккаунт еще не активирован. Мы активируем ваш аккаунт в течение 24
          часов. Для проверки активации перезагрузите страницу, пожалуйста.
        </p>
      )}
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
