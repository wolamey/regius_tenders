import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ErrorPopup from "../../../../Components/ErrorPopup/ErrorPopup";
import InfoPopup from "../../../../Components/InfoPopup/InfoPopup";
import { useLogout } from "../../../../hooks/useLogout";
export default function GetReasonModal({ tenderID, setUnsuitableID }) {
  const [reasonText, setReasonText] = useState("");
  const [cookies] = useCookies(["auth_token"]);
  const [error, setError] = useState("");
  const [infoPopupText, setInfoPopupText] = useState("");
  const [watchInfoPopup, setWatchInfoPopup] = useState(false);
  const logout = useLogout()

  const markAsUnsuitable = async () => {
    if (reasonText === "") {
      setError("Пожалуйста, введите причину");
      return;
    }

    const response = await fetch(
      `https://tenderstest.dev.regiuslab.by/v1/user/tenders/${tenderID}/mark/unsuitable?reason=${reasonText}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${cookies.auth_token}`,
        },
      }
    );

    const data = await response.json();
      if(response.status === 498 || response.status ===  403  ){
      logout()
    }
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    if (response.ok) {
      setWatchInfoPopup(true); // ← включаем “наблюдение”
      setInfoPopupText(data.message || "");
    }

    console.log(data);
  };

  useEffect(() => {
    if (watchInfoPopup && infoPopupText === "") {
      setUnsuitableID("");
      setWatchInfoPopup(false); // сбрасываем, чтобы повторно сработал только при новом вызове
    }
  }, [infoPopupText, watchInfoPopup]);

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-999 h-screen flex ">
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}

      {infoPopupText !== "" && (
        <InfoPopup text={infoPopupText} setInfo={setInfoPopupText} />
      )}

      <div className="bg-white max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[10px]">
        <p className="text-2xl">
          Пожалуйста, введите причину почему данный тендер не подходит
        </p>

        <textarea
          name=""
          className="w-full border-2 border-[#93A188]/50 rounded-lg outline-0 p-[15px] min-h-[150px]"
          placeholder="Введите текст..."
          id=""
          value={reasonText}
          onChange={(e) => setReasonText(e.target.value)}
        ></textarea>

        <div className="grid grid-cols-2 gap-[10px] w-full">
          <button
            onClick={() => setUnsuitableID("")}
            className="p-[10px_25px] w-full bg-[#646d5c]/25 rounded-xl text-[#646d5c] justify-center text-[20px]   hover:bg-[#646d5c]/40 whitespace-nowrap"
          >
            Отмена
          </button>
          <button
            onClick={markAsUnsuitable}
            className="p-[10px_25px] w-full bg-[#646d5c]/90 rounded-xl text-[#ffffff] justify-center text-[20px]   hover:bg-[#646d5c] whitespace-nowrap"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
