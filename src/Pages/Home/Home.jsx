import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import linkSvg from "/imgs/link.svg";
import copySvg from "/imgs/copy.svg";
import watchSvg from "/imgs/watch.svg";
import InputText from "../../Components/InputText/InputText";
import like from "/imgs/like.webp";
import dislike from "/imgs/dislike.webp";
import { useLogout } from "../../hooks/useLogout";
import workImg from "/imgs/work.webp";
import InfoPopup from "../../Components/InfoPopup/InfoPopup";
import GetReasonModal from "./Components/GetReasonModal/GetReasonModal";
import { Link } from "react-router-dom";
export default function Home() {
  const [error, setError] = useState("");
  const [cookies, removeCookie] = useCookies(["auth_token"]);
  const [tenders, setTenders] = useState([]);
  const [filters, setFilters] = useState({ status: "", filter: "" });
  const [infoPopupText, setInfoPopupText] = useState("");
  const [unsuitableID, setUnsuitableID] = useState("");
  const logout = useLogout();
  const getTenders = async () => {
    const params = new URLSearchParams({});

    if (filters.status !== "") {
      params.set("status", filters.status);
    }
    if (filters.filter !== "") {
      params.set("platform", filters.filter);
    }

    const response = await fetch(
      `https://tenderstest.dev.regiuslab.by/v1/user/tenders?${params}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${cookies.auth_token}`,
        },
      }
    );
    const data = await response.json();

    if (response.status === 498 || response.status === 403) {
      return logout();
    }
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    console.log(data);
    setTenders(data);
  };

  useEffect(() => {
    getTenders();
  }, [filters]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("скопировано");
    } catch (err) {
      console.error(err);
    }
  };

  const getFinalAmount = (lots) => {
    let result = 0;
    lots.map((item) => (result += item.price));
    return result;
  };

  const getRemDays = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let result = "";
    if (diffDays === 1) {
      result = "1 день";
    } else if (diffDays < 0) {
      result = "просрочено на " + diffDays + " дней";
    } else if (diffDays < 5) {
      result = diffDays + " дня";
    } else {
      result = diffDays + " дней";
    }
    return result;
  };

  const formatDateOnly = (dateString) => {
    return dateString.split("T")[0];
  };

  const markAsSuitable = async (tenderID) => {
    const response = await fetch(
      `https://tenderstest.dev.regiuslab.by/v1/user/tenders/${tenderID}/mark/suitable`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${cookies.auth_token}`,
        },
      }
    );

    const data = await response.json();
    if (response.status === 498 || response.status === 403) {
      logout();
    }
    if (!response.ok) {
      setError(data.detail);
      return;
    }
    if (response.ok) {
      setInfoPopupText(data.message);
    }
    console.log(data);
  };

  const MarkAsTakenIntoWork = async (tenderID) => {
    const response = await fetch(
      `https://tenderstest.dev.regiuslab.by/v1/user/tenders/${tenderID}/mark/taken_into_work`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${cookies.auth_token}`,
        },
      }
    );

    const data = await response.json();
    if (response.status === 498 || response.status === 403) {
      logout();
    }
    if (!response.ok) {
      setError(data.detail);

      return;
    }
    if (response.ok) {
      setInfoPopupText(data.message);
    }
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-[30px] ">
      {infoPopupText !== "" && (
        <InfoPopup text={infoPopupText} setInfo={setInfoPopupText} />
      )}
      {unsuitableID !== "" && (
        <GetReasonModal
          tenderID={unsuitableID}
          setUnsuitableID={setUnsuitableID}
        />
      )}
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
      <div className="flex  gap-[20px] ">
        <select
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            console.log(e.target.value);
          }}
          name=""
          id=""
          className="cursor-pointer auth_input w-full rounded-lg bg-white pr-[20px] pl-[20px] pt-[10px] pb-[10px] border  border-transparent
 focus-visible:border-gray-500  focus-visible:bg-gray-100/40 outline-0"
        >
          <option value="">Cтатус тендера</option>
          <option value="open">open</option>
          <option value="work">work</option>
          <option value="completed">completed</option>
          <option value="cancelled">canceled</option>
        </select>

        <InputText
          value={filters.filter}
          type={"text"}
          onChange={(e) => setFilters({ ...filters, filter: e.target.value })}
          placeholder={"Фильтр по площадке тендера"}
          isRequired={false}
        />
      </div>

      <div className="flex flex-col gap-[30px]">
        {tenders.length !== 0 ? (
          tenders.map((item, index) => (
            <div
              className="bg-[#F6FCF2] p-[30px] rounded-lg relative flex flex-col gap-[30px]"
              key={index}
            >
              <div
                className={`${
                  item.status === "open"
                    ? "bg-[#F7FFD7] text-[#817925] border-[#dbd415]"
                    : item.status === "work"
                    ? "bg-[#ECECEC] text-[#545454] border-[#707070]"
                    : item.status === "completed"
                    ? "bg-[#E4FFD7] text-[#3D6821] border-[#5FB059]"
                    : "bg-[#FFD7D7] text-[#682121] border-[#B05959]"
                } absolute  top-[-10px] right-[-10px] border-2 rounded-2xl w-fit p-[0_15px] `}
              >
                {item.status}
              </div>
              <div className="flex justify-between w-full items-center flex-wrap gap-[20px]">
                <div className="flex flex-col ">
                  <p className="text-3xl font-medium text-center">
                    {item.name}
                  </p>

                  <Link
                    to={item.link}
                    className="flex gap-[5px] text-[#646D5C] "
                  >
                    <img src={linkSvg} alt="" className="w-[15px] " />
                    {item.link}
                  </Link>
                </div>

                <div
                  onClick={() => copyToClipboard(item.tender_number)}
                  className="flex gap-[5px] cursor-pointer group"
                >
                  <img src={copySvg} alt="" className="w-[15px]" />
                  <p className="group-hover:text-[#646D5C]">
                    {item.tender_number}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-black/60">Сумма:</p>
                  <p className=" text-xl font-extrabold">
                    {getFinalAmount(item.lots)} {item.lots[0].currency}
                  </p>
                </div>

                <div className="flex gap-[5px] items-center">
                  <img src={watchSvg} className="w-[18px]" alt="" />

                  <p className="text-xl text-[#646D5C]">
                    {getRemDays(item.end_date)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[2fr_3fr] gap-[30px] items-center">
                <div className="grid grid-cols-[auto_3fr] gap-[10px_25px] items-center">
                  <p className="text-xs text-black/60">Заказчик:</p>
                  <p className="">{item.platform.name}</p>
                  <p className="text-xs text-black/60">Даты подачи:</p>
                  <p className="">
                    {formatDateOnly(item.start_date)} -{" "}
                    {formatDateOnly(item.end_date)}
                  </p>

                  <div className=" col-span-full grid grid-cols-[1fr_1fr] pt-[15px] gap-[15px]">
                    <button
                      onClick={() => markAsSuitable(item.id)}
                      className="p-[10px_25px] flex items-center gap-[5px] bg-[#646d5c]/25 rounded-xl text-[#646d5c] justify-center text-[20px]   hover:bg-[#646d5c]/40 whitespace-nowrap"
                    >
                      <img className="w-[23px]" src={like} alt="" />
                      Подходящий
                    </button>
                    <button
                      onClick={() => setUnsuitableID(item.id)}
                      className="p-[10px_25px] flex items-center gap-[5px] bg-[#646d5c]/25 rounded-xl text-[#646d5c] justify-center text-[20px]   hover:bg-[#646d5c]/40 whitespace-nowrap"
                    >
                      <img className="w-[23px]" src={dislike} alt="" />
                      Не подходящий
                    </button>
                    <button
                      onClick={() => MarkAsTakenIntoWork(item.id)}
                      className=" col-span-full p-[10px_25px] flex items-center gap-[5px] bg-[#646d5c]/10 rounded-xl text-[#646d5c] justify-center text-[20px] border-2 border-[#646d5c]  hover:bg-[#646d5c]/20 whitespace-nowrap"
                    >
                      <img className="w-[25px]" src={workImg} alt="" />В работу
                    </button>
                  </div>
                </div>

                <div className="flex gap-[10px] flex-wrap bg-white p-[20px] rounded-2xl">
                  {item.lots.map((lot) => (
                    <div
                      className="bg-[#DDEDD1] p-[3px_15px] rounded-2xl"
                      key={lot.id}
                    >
                      {lot.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="m-auto">
            <Loader isFull={false} color={"#646D5C"} />
          </div>
        )}
      </div>
    </div>
  );
}
