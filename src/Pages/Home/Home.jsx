import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import linkSvg from "/imgs/link.svg";
import copySvg from "/imgs/copy.svg";
import watchSvg from "/imgs/watch.svg";
import LikeIcon from "../../assets/images/like.svg?react";
import Dislike from "../../assets/images/dislike.svg?react";
import { useLogout } from "../../hooks/useLogout";
import WorkImg from "../../assets/images/work.svg?react";
import InfoPopup from "../../Components/InfoPopup/InfoPopup";
import GetReasonModal from "./Components/GetReasonModal/GetReasonModal";
import { Link } from "react-router-dom";
import LotsWrap from "./Components/LotsWrap/LotsWrap";
import { Store } from "react-notifications-component";
import { notify } from "../../utils/notify";
import { tryProtectedRequest } from "../../utils/tryProtectedRequest";
export default function Home({ refreshToken }) {
  const [error, setError] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);
  const [tenders, setTenders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    platform: "",
  });
  const [infoPopupText, setInfoPopupText] = useState("");
  const [unsuitableID, setUnsuitableID] = useState("");
  const [userStatustes, setUserStatuses] = useState(null);
  const [platformStatustes, setPlatformStatuses] = useState(null);
  const [tendersLoader, setTendersLoader] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isFiltersHidden, setIsFiltersHidden] = useState(false);


  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    // console.log(screenWidth);
    setIsFiltersHidden(screenWidth < 1024 ? true : false);
    // console.log(isFiltersHidden);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const logout = useLogout();

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [totalPages, setTotalPages] = useState(1);

  const getTenders = async () => {
    setTendersLoader(true);
    const params = new URLSearchParams();
    if (filters.status) params.set("user_status", filters.status);
    if (filters.platform) params.set("platform_status", filters.platform);
    params.set("page", page);
    params.set("page_size", PAGE_SIZE);

    try {
      const { data, response } = await tryProtectedRequest({
        url: `https://tendersiteapi.dev.regiuslab.by/v1/user/tenders?${params}`,
        method: "GET",
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({ title: "Ошибка", message: data.detail, type: "danger" });
        return;
      }

      setTenders(data.tenders);
      setTotalPages(data.total_pages);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // setError(msg);
      notify({ title: "Ошибка", message: msg, type: "danger" });
    } finally {
      setTendersLoader(false);
    }
  };

  // reload on filters or page change
  useEffect(() => {
    getTenders();
  }, [filters, page]);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const onSelectPage = (p) => setPage(p);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // console.log("скопировано");

      notify({
        title: "Скопировано",
        message: `ID "${text}" скопировано`,
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getFinalAmount = (lots) => {
    let result = 0;
    lots.map((item) => (result += item.price));
    return result;
  };
  function getDaySuffix(number) {
    const absNum = Math.abs(number);
    const lastDigit = absNum % 10;
    const lastTwoDigits = absNum % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "дней";
    }

    if (lastDigit === 1) return "день";
    if (lastDigit >= 2 && lastDigit <= 4) return "дня";
    return "дней";
  }

  const getRemDays = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let result;

    if (diffDays === 0) {
      result = "Сегодня последний день";
    } else if (diffDays < 0) {
      result = `просрочено на ${Math.abs(diffDays)} ${getDaySuffix(diffDays)}`;
    } else {
      result = `${diffDays} ${getDaySuffix(diffDays)}`;
    }

    return result;
  };

  const formatDateOnly = (dateString) => {
    return dateString.split("T")[0];
  };

  const markAsSuitable = async (id) => {
    const { data, response } = await tryProtectedRequest({
      url: `https://tendersiteapi.dev.regiuslab.by/v1/user/tenders/${id}/mark/suitable`,
      method: "POST",
      token: cookies.auth_token,
      refreshToken,
      logout,
    });

    if (!response.ok) {
      notify({ title: "Ошибка", message: data.detail, type: "danger" });
      return;
    }

    notify({ title: "Успешно", message: data.message, type: "success" });
    getTenders();
  };

  const MarkAsTakenIntoWork = async (tenderID) => {
    try {
      const { data, response } = await tryProtectedRequest({
        url: `https://tendersiteapi.dev.regiuslab.by/v1/user/tenders/${tenderID}/mark/taken_into_work`,
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

      notify({
        title: "Успешно",
        message: data.message,
        type: "success",
      });

      getTenders();
    } catch (err) {
      notify({
        title: "Ошибка",
        message: err,
        type: "danger",
      });
    }
  };
  const getUserStatuses = async () => {
    try {
      const response = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/util/status/user",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.status === 404) {
        logout();
      }
      if (response.ok) {
        setUserStatuses(data);
      }
    } catch (err) {
      // setError(err);
      notify({
        title: "Ошибка",
        message: err,
        type: "danger",
      });
    }
  };

  useEffect(() => {
    getUserStatuses();
  }, []);

  const getPlatformStatuses = async () => {
    try {
      const response = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/util/status/platform",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      if (response.status === 404) {
        logout();
      }
      if (response.ok) {
        setPlatformStatuses(data);
      }
    } catch (err) {
      // setError(err);

      notify({
        title: "Ошибка",
        message: err,
        type: "danger",
      });
    }
  };

  useEffect(() => {
    getPlatformStatuses();
  }, []);

  const earaseFilters = () => {
    setFilters({
      status: "",
      platform: "",
    });
  };

  return (
    <div className="flex flex-col ">
      {infoPopupText !== "" && (
        <InfoPopup text={infoPopupText} setInfo={setInfoPopupText} />
      )}
      {unsuitableID !== "" && (
        <GetReasonModal
          tenderID={unsuitableID}
          setUnsuitableID={setUnsuitableID}
          getTenders={getTenders}
          refreshToken={refreshToken}
        />
      )}
      <div className=" sticky top-0 z-9 bg-[#DBEBCF]">
        <div
          className={`overflow-hidden flex flex-col    gap-[20px] pr-[20px]  pl-[20px]   ${
            isFiltersHidden ? "max-h-[0px] " : "max-h-[900px] pb-[20px] "
          } `}
        >
          <div className="grid grid-cols-[1fr_1fr]  gap-[20px] filters">
            <div className="flex flex-col gap-[5px]">
              <p>Пользовательский статус</p>

              <ul className="flex gap-[10px] flex-wrap">
                {userStatustes ? (
                  Object.entries(userStatustes).map(([key, value]) => (
                    <li
                      onClick={() => {
                        setFilters((prev) => {
                          const updated = {
                            ...prev,
                            status: filters.status === key ? "" : key,
                          };
                          // console.log(updated);
                          return updated;
                        });
                      }}
                      className={`${
                        filters.status === key
                          ? "bg-white"
                          : "bg-white/30 hover:bg-white/60"
                      } border-2 border-[#646D5C] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item`}
                      key={key}
                      value={key}
                    >
                      {value}
                    </li>
                  ))
                ) : (
                  <Loader isFull={false} />
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-[5px] ">
              <p>Статус платформы</p>

              <ul className="flex gap-[10px] flex-wrap">
                {platformStatustes ? (
                  Object.entries(platformStatustes).map(([key, value]) => (
                    <li
                      onClick={() => {
                        setFilters((prev) => {
                          const updated = {
                            ...prev,
                            platform: key === filters.platform ? "" : key,
                          };
                          // console.log(updated);
                          return updated;
                        });
                      }}
                      className={`${
                        filters.platform === key
                          ? "bg-white"
                          : "bg-white/30 hover:bg-white/60"
                      } border-2 border-[#646D5C] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item `}
                      key={key}
                      value={key}
                    >
                      {value}
                    </li>
                  ))
                ) : (
                  <Loader isFull={false} />
                )}
              </ul>
            </div>
          </div>

          <button
            onClick={earaseFilters}
            className={`${
              filters.platform === "" && filters.status === ""
                ? "opacity-50 pointer-events-none"
                : ""
            }  p-[10px_20px] underline border-2 border-[#B05959] rounded-xl bg-[#ffacac]/20 hover:bg-[#ffacac]/50`}
          >
            Очистить все фильтры
          </button>
        </div>
        <div
          className="showFilters rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap w-[-webkit-fill-available] text-center bg-white flex gap-[5px] justify-center items-center hidden m-[0_20px_20px_20px]"
          onClick={() => setIsFiltersHidden(!isFiltersHidden)}
        >
          Фильтры
          {isFiltersHidden ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
            >
              <g clip-path="url(#clip0_90_8)">
                <path
                  d="M11.582 6.26953L6.99906 10.5L2.41609 6.26953"
                  stroke="black"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 10.5L7 1.5"
                  stroke="black"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_90_8">
                  <rect
                    width="12"
                    height="13"
                    fill="white"
                    transform="matrix(0 1 -1 0 13.5 0)"
                  />
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
            >
              <g clip-path="url(#clip0_90_8)">
                <path
                  d="M11.582 5.73047L6.99906 1.50004L2.41609 5.73047"
                  stroke="black"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 1.50005L7 10.5"
                  stroke="black"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_90_8">
                  <rect
                    width="12"
                    height="13"
                    fill="white"
                    transform="matrix(0 -1 -1 0 13.5 12)"
                  />
                </clipPath>
              </defs>
            </svg>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[30px] p-[20px]">
        {tendersLoader ? (
          <div className="m-auto">
            <Loader isFull={false} color="#646D5C" />
          </div>
        ) : tenders.length === 0 ? (
          <p className="text-[24px] text-center">
            К сожалению, по данным фильтрам тендера не найдены :(
          </p>
        ) : tenders.length !== 0 ? (
          <div className=" ">
            <div className=" flex flex-col gap-[30px] 	sm:p-[20px] ">
              {tenders.map((item, index) => (
                <div
                  className="bg-[#F6FCF2] p-[30px] rounded-lg relative flex flex-col gap-[30px] card "
                  key={index}
                >
                  <div className=" absolute  top-[-10px] right-[-10px] flex gap-[10px] ">
                    <div
                      className={`${
                        item.status === "open"
                          ? "bg-[#F7FFD7] text-[#817925] border-[#dbd415]"
                          : item.status === "work"
                          ? "bg-[#ECECEC] text-[#545454] border-[#707070]"
                          : item.status === "completed"
                          ? "bg-[#E4FFD7] text-[#3D6821] border-[#5FB059]"
                          : "bg-[#FFD7D7] text-[#682121] border-[#B05959]"
                      } border-2 rounded-2xl w-fit p-[0_15px] tag `}
                    >
                      {item.status === "open"
                        ? "Подача документов"
                        : item.status === "work"
                        ? "Работа комиссии"
                        : item.status === "completed"
                        ? "Завершен"
                        : "Отменен"}
                    </div>
                    <div
                      className={`${
                        item.user_status === "not_reviewed"
                          ? "bg-[#F7FFD7] text-[#817925] border-[#dbd415]"
                          : item.user_status === "taken_into_work"
                          ? "bg-[#ECECEC] text-[#545454] border-[#707070]"
                          : item.user_status === "suitable"
                          ? "bg-[#E4FFD7] text-[#3D6821] border-[#5FB059]"
                          : "bg-[#FFD7D7] text-[#682121] border-[#B05959]"
                      } border-2 rounded-2xl w-fit p-[0_15px]  tag`}
                    >
                      {item.user_status === "not_reviewed"
                        ? "Не рассмотрен"
                        : item.user_status === "suitable"
                        ? "Подходящий"
                        : item.user_status === "Подходящий"
                        ? "Не подходящий"
                        : "Взят в работу"}
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <p className="text-3xl font-medium  mb-[30px]">
                      {item.name}
                    </p>
                    <div className="flex justify-between w-full items-center flex-wrap gap-[10px_30px] card-basic">
                      <Link
                        to={item.link}
                        className="  flex gap-[5px] text-[#646D5C] whitespace-nowrap  overflow-hidden text-ellipsis"
                      >
                        <img src={linkSvg} alt="" className="w-[15px] " />
                        ссылка на тендер
                      </Link>
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
                        <p className="text-m text-black/60 ">Сумма:</p>
                        <p className=" text-xl font-extrabold">
                          {getFinalAmount(item.lots)} {item.lots[0].currency}
                        </p>
                      </div>

                      <div className="flex gap-[5px] items-center">
                        <img src={watchSvg} className="w-[18px]" alt="" />

                        <p className="text-xl text-[#646D5C]">
                          {getRemDays(item.end_date_2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className=" grid grid-cols-[2fr_3fr] gap-[30px] items-end tender-main">
                    <div className="grid grid-cols-[auto_3fr] gap-[0px_25px] items-center tender-left">
                      <p className="text-m text-black/60 col-span-full">
                        {" "}
                        Заказчик:
                      </p>
                      <p className="card_info-item col-span-full mb-[15px]">
                        {item.customer_name}
                      </p>
                      <p className="text-m text-black/60 col-span-full">
                        Платформа:
                      </p>
                      <p className="card_info-item col-span-full  mb-[15px]">
                        {item.platform.name}
                      </p>
                      <p className="text-m text-black/60 col-span-full">
                        Даты подачи:
                      </p>
                      <p className="card_info-item col-span-full  mb-[15px]">
                        {formatDateOnly(item.start_date)} -{" "}
                        {formatDateOnly(item.end_date)}
                      </p>

                      <div className="col-span-full flex flex-wrap gap-[15px] pt-[15px] btn-wrapper ">
                        <button
                          onClick={() => markAsSuitable(item.user_tender_id)}
                          className={`${
                            item.user_status === "suitable"
                              ? "bg-[#646d5c]/75 text-[#F6FCF2] active pointer-events-none"
                              : "bg-[#646d5c]/25 hover:bg-[#646d5c]/40 text-[#646d5c]"
                          } button-suitable flex items-center justify-center gap-[5px] rounded-xl p-[10px_25px] text-[20px] whitespace-nowrap w-full  sm:w-[calc(50%-7.5px)] min-w-[200px] `}
                        >
                          <LikeIcon className="item-button-svg" />
                          Подходящий
                        </button>

                        <button
                          onClick={() => setUnsuitableID(item.user_tender_id)}
                          className={`${
                            item.user_status === "unsuitable"
                              ? "bg-[#646d5c]/75 text-[#F6FCF2] active pointer-events-none"
                              : "bg-[#646d5c]/25 hover:bg-[#646d5c]/40 text-[#646d5c]"
                          } button-suitable flex items-center justify-center gap-[5px] rounded-xl p-[10px_25px] text-[20px] whitespace-nowrap w-full sm:w-[calc(50%-7.5px)] min-w-[200px]`}
                        >
                          <Dislike className="item-button-svg" />
                          Не подходящий
                        </button>

                        <button
                          onClick={() =>
                            MarkAsTakenIntoWork(item.user_tender_id)
                          }
                          className={`${
                            item.user_status === "taken_into_work"
                              ? "bg-[#646d5c]/75 text-[#F6FCF2] active pointer-events-none"
                              : "bg-[#646d5c]/10 hover:bg-[#646d5c]/20 text-[#646d5c] border-[#646d5c]"
                          } button-suitable col-span-full flex w-full items-center justify-center gap-[5px] rounded-xl border-2 p-[10px_25px] text-[20px] whitespace-nowrap`}
                        >
                          <WorkImg className="item-button-svg" />В работу
                        </button>
                      </div>
                    </div>
                    <LotsWrap lots={item.lots} index={index} />
                    {/* <div className="lots-wrap bg-white p-[20px] rounded-2xl  overflow-hidden relative">
                  <div className="absolute bottom-0 bg-fade-white h-[70px] w-full"></div>
                  <p className="text-2xl mb-[20px]">Лоты: {item.lots.length}</p>
                  <div className="flex gap-[10px] flex-wrap ">
                    {item.lots.map((lot) => (
                      <div
                        className="bg-[#DDEDD1] p-[3px_15px] rounded-2xl"
                        key={lot.id}
                      >
                        {lot.name}
                      </div>
                    ))}
                  </div>
                </div> */}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-3 py-4">
              <button
                onClick={onPrev}
                disabled={page === 1}
                className="px-3 py-1 border-2 border-[#646D5C] rounded-lg disabled:opacity-50  hover:bg-[#F0F6EB]"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => onSelectPage(p)}
                    className={`px-3 py-1 border-2 border-[#646D5C] rounded-lg ${
                      p === page
                        ? "bg-[#646D5C] text-white"
                        : " hover:bg-[#F0F6EB]"
                    }`}
                  >
                    {p}
                  </button>
                ))}

              <button
                onClick={onNext}
                disabled={page === totalPages}
                className="px-3 py-1 border-[#646D5C] border-2 rounded-lg disabled:opacity-50  hover:bg-[#F0F6EB]"
              >
                →
              </button>
            </div>
          </div>
        ) : (
          <div className="m-auto">
            <Loader isFull={false} color={"#646D5C"} />
          </div>
        )}
      </div>
    </div>
  );
}
