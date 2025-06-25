import React from "react";

export default function LotsFull({ lots, setShowFull }) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-xs bg-[#646D5C]/50 z-[999999999] h-screen flex"
      onClick={() => setShowFull(false)} // для закрытия по клику снаружи
    >
      <div
        className="bg-white max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col gap-[20px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
      >
        <h2 className="text-2xl text-center">Список лотов</h2>

        <div className="flex flex-col gap-[10px] max-h-[50vh] overflow-auto">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="bg-[#DDEDD1] p-[10px_15px] rounded-xl grid grid-cols-[1fr_4fr_1fr] text-sm"
            >
              <span>{lot.id}</span>
              <span>{lot.name}</span>
              <span className="text-gray-700 font-medium ">
                {lot.price} {lot.currency}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowFull([])}
          className="p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c] m-auto w-full"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
