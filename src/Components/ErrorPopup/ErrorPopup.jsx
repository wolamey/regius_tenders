import React from "react";
import crossImg from '/imgs/close-square.svg'
export default function ErrorPopup({ errText, setError }) {
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-999999999999 h-screen flex ">
      <div className="bg-white max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[10px]">
        <img src={crossImg} alt="" className="cursor-pointer hover:scale-110" onClick={()=>setError('')} />
        <p className="text-2xl">
        {errText}

        </p>
      </div>
    </div>
  );
}
