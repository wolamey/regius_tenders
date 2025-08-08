import React, { useEffect, useState } from "react";

import proYear from "../../assets/images/pro_year.png";

import proMonth from "../../assets/images/pro_month.png";
import proHalf from "../../assets/images/pro_half.png";

import Present from "../../assets/images/present.svg?react";

import "./Pro.scss";
import { tryProtectedRequest } from "../../utils/tryProtectedRequest";
import { useLogout } from "../../hooks/useLogout";
import { notify } from "../../utils/notify";
import { formatNumberWithSpaces } from "../../utils/formatNumberWithSpaces";
import useUserInfo from "../../hooks/useUserInfo";
import Loader from "../../Components/Loader/Loader";
import { useCookies } from "react-cookie";
export default function Pro({ refreshToken }) {
  const images = [proMonth, proHalf, proYear];
  const { userInfo, error, setError } = useUserInfo(refreshToken);
  const [currentUser, setCurrentUser] = useState();

  const [waitingPhrase, setWaitingPhrase] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [bill, setBill] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies([
    "auth_token",
    "theme",
    "isDark",
  ]);
  const logout = useLogout();
  const [tarifs, setTarifs] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const getTarifs = async () => {
    try {
      const { data, response } = await tryProtectedRequest({
        url: `https://tendersiteapi.dev.regiuslab.by/v1/util/subscription-plans`,
        method: "GET",
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({ title: "Ошибка", message: data.detail, type: "danger" });
        return;
      }

      setTarifs(data.plans);
      console.log(data.plans);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // setError(msg);
      notify({ title: "Ошибка", message: msg, type: "danger" });
    }
  };

  useEffect(() => {
    getTarifs();
  }, []);

  const createInvoice = async (subscriptionplanid) => {
    setWaitingPhrase(
      "Ожидайте, создаем для Вас счет для оплаты. Это займет не более минуты :)"
    );

    setWaiting(true);

    try {
      const sendData = {
        site_user_id: userInfo.id,
        subscription_plan_id: subscriptionplanid,
      };
      const { data, response } = await tryProtectedRequest({
        url: `https://tendersiteapi.dev.regiuslab.by/v1/invoices/create`,
        method: "POST",
        body: sendData,
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({ title: "Ошибка", message: data.detail, type: "danger" });
        return;
      }
      setBill(data.invoice_id);

      console.log(data.invoice_id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // setError(msg);
      notify({ title: "Ошибка", message: msg, type: "danger" });
    }
  };

  const viewInvoice = async () => {
    if (!bill) {
      console.log("!bill");
      return;
    }

    try {
      const response = await fetch(
        `https://tendersiteapi.dev.regiuslab.by/v1/invoices/view/${bill}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.auth_token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        // Попробуем прочитать текст ошибки, если это не PDF
        const errorText = await response.text();
        notify({
          title: "Ошибка",
          message: errorText || "Не удалось получить счет",
          type: "danger",
        });
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      notify({
        title: "Успешно",
        message: "Счет успешно получен",
        type: "success",
      });

      setWaitingPhrase("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      notify({ title: "Ошибка2", message: msg, type: "danger" });
    }
  };

  useEffect(() => {
    if (bill) {
      viewInvoice();
    }
  }, [bill]);

  const downloadInvoice = async () => {
    if (!bill) {
      notify({ title: "Ошибка", message: "Счет не найден", type: "danger" });
      return;
    }

    try {
      const response = await fetch(
        `https://tendersiteapi.dev.regiuslab.by/v1/invoices/download/${bill}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.auth_token}`,
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        notify({
          title: "Ошибка",
          message: errorText || "Не удалось скачать счет",
          type: "danger",
        });
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Получаем имя файла из заголовка, если нужно
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const filename = filenameMatch?.[1] || `invoice_${bill}.pdf`;

      // Создаем ссылку и инициируем скачивание
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      notify({
        title: "Успешно",
        message: "Счет скачан",
        type: "success",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      notify({ title: "Ошибка", message: msg, type: "danger" });
    }
  };

  return (
    <div className="flex flex-col gap-20">
      {waiting && (
        <div className="flex flex-col gap-3 absolute justify-center items-center top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[var(--bg-modal)]/50 z-999 h-screen ">
          {waitingPhrase && (
            <div className="flex flex-col gap-3 items-center">
              <p className="text-white">{waitingPhrase}</p>
              <div className="opacity-70">
                <Loader isFull={false} color="white" />
              </div>
            </div>
          )}

          {pdfUrl && (
            <div className="">
              <iframe
                src={pdfUrl}
                title="Invoice PDF"
                className="w-[90vh] h-[80vh]"
              />
              <div className="flex w-fit m-auto gap-5">
                <button
                  className={`block p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] mt-[10px] m-auto`}
                  onClick={() => {
                    downloadInvoice();
                  }}
                >
                  Скачать счет
                </button>
                <button
                  className={`block p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/20 cursor-pointer hover:bg-[var(--main)] mt-[10px] m-auto`}
                  onClick={() => {
                    setWaiting(null);
                    setPdfUrl(null)
                  }}
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col justify-center items-center gap-4 pt-10 max-w-[90%] m-auto ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 27 25"
          fill="none"
        >
          <path
            d="M16.5493 14.1494L15.3334 10.8467C15.0587 10.1006 14.3415 9.5684 13.5 9.5684C12.6585 9.5684 11.9413 10.1006 11.6665 10.8467L10.4506 14.1494C10.1758 14.8956 9.45867 15.4278 8.61717 15.4278C7.77567 15.4278 7.05848 14.8956 6.78373 14.1494L5.76312 10.8467C5.48832 10.1006 4.77118 9.5684 3.92968 9.5684C2.85102 9.5684 1.97656 10.4428 1.97656 11.5215V21.2871C1.97656 22.3658 2.85102 23.2402 3.92968 23.2402H23.0703C24.149 23.2402 25.0234 22.3658 25.0234 21.2871V11.5215C25.0234 10.4428 24.149 9.5684 23.0703 9.5684C22.2287 9.5684 21.5116 10.1006 21.2368 10.8467L20.2162 14.1494C19.9415 14.8956 19.2243 15.4278 18.3828 15.4278C17.5412 15.4278 16.8241 14.8956 16.5493 14.1494Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.8828 3.70899C5.8828 4.78765 5.00834 5.66211 3.92968 5.66211C2.85102 5.66211 1.97656 4.78765 1.97656 3.70899C1.97656 2.63033 2.85102 1.75587 3.92968 1.75587C5.00834 1.75587 5.8828 2.63033 5.8828 3.70899Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.4531 3.70899C15.4531 4.78765 14.5787 5.66211 13.5 5.66211C12.4213 5.66211 11.5468 4.78765 11.5468 3.70899C11.5468 2.63033 12.4213 1.75587 13.5 1.75587C14.5787 1.75587 15.4531 2.63033 15.4531 3.70899Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M25.0234 3.70899C25.0234 4.78765 24.149 5.66211 23.0702 5.66211C21.9915 5.66211 21.1171 4.78765 21.1171 3.70899C21.1171 2.63033 21.9915 1.75587 23.0702 1.75587C24.149 1.75587 25.0234 2.63033 25.0234 3.70899Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <div className=" flex flex-col gap-2">
          <p className="text-center text-3xl">Выберите ваш премиум план</p>

          <p className="text-center opacity-50 max-w-[700px]">
            Разблокируйте весь потенциал ByTenders.by, пользуйтесь в любое время
            и с любого устройства с особым комфортом, ведь мы сделали этот
            продукт с любовью для Вас!
          </p>
        </div>
      </div>
      <div className="md:grid  md:grid-cols-3 flex flex-col gap-10 md:gap-5 max-w-[800px] m-auto w-full">
        {tarifs ? (
          tarifs.map((item, index) => (
            <div className="cardP m-auto" key={index}>
              <div className="cardP__shine"></div>
              <div className="cardP__glow"></div>
              <div className="cardP__content ">
                <div className="cardP__badge">{item.hint}</div>
                <div className="cardP__image">
                  <img src={images[index]} alt="" />
                </div>
                <div className="cardP__text">
                  <p className="cardP__title">{item.name}</p>

                  {item.gift_text && (
                    <div className="flex gap-2 text-[var(--main)] items-center">
                      <Present />
                      <p className="cardP__description leading-3">
                        {item.gift_text}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2  items-center">
                    {item.description && (
                      <p className="cardP__description leading-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="cardP__footer">
                  <div className="flex flex-col">
                    <div className="cardP__price">
                      {formatNumberWithSpaces(item.discounted_price)} BYN
                    </div>

                    {item.price !== 0 && (
                      <div className=" text-xs opacity-50 line-through leading-1">
                        {formatNumberWithSpaces(item.price)} BYN
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => createInvoice(item.id)}
                    className="cardP__button"
                  >
                    <svg height="16" width="16" viewBox="0 0 24 24">
                      <path
                        stroke-width="2"
                        stroke="currentColor"
                        d="M4 12H20M12 4V20"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className=" col-span-3 w-fit  m-auto">
            <Loader isFull={false} color="var(--main)" />
          </div>
        )}
      </div>
    </div>
  );
}
