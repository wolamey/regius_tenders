import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ErrorPopup from "../../../../Components/ErrorPopup/ErrorPopup";
import InfoPopup from "../../../../Components/InfoPopup/InfoPopup";
import { useLogout } from "../../../../hooks/useLogout";
import { Store } from "react-notifications-component";
import { notify } from "../../../../utils/notify";
import { tryProtectedRequest } from "../../../../utils/tryProtectedRequest";
export default function GetReasonModal({ tenderID, setUnsuitableID ,getTenders,refreshToken}) {
  const [reasonText, setReasonText] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);
  const [error, setError] = useState("");
  const [infoPopupText, setInfoPopupText] = useState("");
  const [watchInfoPopup, setWatchInfoPopup] = useState(false);
  const logout = useLogout()

const markAsUnsuitable = async () => {
  if (reasonText === "") {
    notify({
      title: "Предупреждение",
      message: "Пожалуйста, введите причину",
      type: "warning",
    });
    return;
  }

  try {
    const { data, response } = await tryProtectedRequest({
      url: `https://tendersiteapi.dev.regiuslab.by/v1/user/tenders/${tenderID}/mark/unsuitable?reason=${encodeURIComponent(
        reasonText
      )}`,
      method: "POST",
      token: cookies.auth_token,
      refreshToken,
      logout,
    });

    if (!response.ok) {
      notify({
        title: "Ошибка",
        message: data.detail,
        type: "danger",
      });
      return;
    }

    setWatchInfoPopup(true);
    getTenders();

    notify({
      title: "Успешно",
      message: data.message,
      type: "success",
    });
  } catch (err) {
    notify({
      title: "Ошибка",
      message: "Ошибка сети: " + err,
      type: "danger",
    });
  }
};

  useEffect(() => {
    if (watchInfoPopup && infoPopupText === "") {
      setUnsuitableID("");
      setWatchInfoPopup(false); // сбрасываем, чтобы повторно сработал только при новом вызове
    }
  }, [infoPopupText, watchInfoPopup]);

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-99 h-screen flex ">
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
