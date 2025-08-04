import React, { useRef, useLayoutEffect, useState } from "react";
import LotsFull from "../LotsFull/LotsFull";

export default function LotsWrap({ lots, index ,isDark}) {
  const ref = useRef(null);
  const [showFade, setShowFade] = useState([]);
  const [showFull, setShowFull] = useState([]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const height = ref.current.clientHeight;

    setShowFade((prev) => {
      const updated = [...prev];
      updated[index] = height > 170;
      return updated;
    });
  }, [lots.length, index]);

  return (
    <div
      ref={ref}
      className="lots-wrap bg-[var(--lots)] p-[20px] rounded-2xl max-h-[250px] overflow-hidden relative w-full"
    >
      {showFull.length > 0 && (
        <LotsFull lots={lots} setShowFull={setShowFull} />
      )}

      {showFade[index] && (
        <div className="absolute bottom-0 left-0 right-0 bg-fade-white h-[100px] w-full flex justify-center">
          <button
            className={`text-center text-[var(--main)] underline mt-auto mb-[10px] hover:text-black ${isDark ? 'hover:text-white' : 'hover:text-black' }`}
            onClick={() => setShowFull(lots)}
          >
            Смотреть все...
          </button>
        </div>
      )}
      <div className="flex justify-between w-full mb-[20px] items-center">
        <p className="text-2xl ">Лоты: {lots.length}</p>

        <button
          className="p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] "
          onClick={() => setShowFull(lots)}
        >
          Подробнее
        </button>
      </div>
      <div className="flex gap-[10px] flex-wrap">
        {lots.map((lot) => (
          <div key={lot.id} className="bg-[var(--bg)] border-1 border-[var(--lots)] p-[3px_15px] rounded-2xl">
            {lot.name}
          </div>
        ))}
      </div>
    </div>
  );
}
