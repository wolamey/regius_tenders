import React from "react";

export default function LotsFull({ lots, setShowFull }) {
  // console.log(lots.length);
  return (
    <div
      className="fixed inset-0 backdrop-blur-xs bg-[var(--bg-modal)]/50 z-[999] h-screen flex"
      onClick={() => setShowFull(false)} // для закрытия по клику снаружи
    >
      <div
        className="bg-[var(--bg)] max-w-[90vh] m-auto w-full p-[30px] rounded-2xl flex flex-col gap-[20px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
      >
        <p className="text-2xl text-center">Лоты: {lots.length}</p>

        <div className=" overflow-auto">
        <div className="flex flex-col gap-1 min-w-[550px] overflow-auto">

          <div className="flex flex-col gap-[10px] max-h-[50vh] overflow-auto">
        <div className=" p-[10px_15px] rounded-xl grid grid-cols-[1fr_3fr_1fr_1fr] text-sm gap-[20px]">
          <p>ID</p>
          <p>Описание</p>
          <p >Количество</p>
          <p>Цена</p>

        </div>
        </div>
        <div className="flex flex-col gap-[10px] max-h-[50vh] overflow-auto">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="bg-[var(--bg2)] p-[10px_15px] rounded-xl grid grid-cols-[1fr_3fr_1fr_1fr] text-sm gap-[20px]"
            >
              <span>{lot.id}</span>
              <span>{lot.name}</span>
              <span className="pl-2">{lot.quantity}</span>
              <span className=" font-medium  whitespace-nowrap">
                {lot.price} {lot.currency}
              </span>
            </div>
          ))}
        </div>
</div>
</div>
        <button
          onClick={() => setShowFull([])}
          className="p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] m-auto w-full"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
