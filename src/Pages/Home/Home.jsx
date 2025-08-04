import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import LinkSvg from "../../assets/images/link.svg?react";
import CopySvg from "../../assets/images/copy.svg?react";
import WatchSvg from "../../assets/images/watch.svg?react";
import Dots from "../../assets/images/dots.svg?react";
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
import { Highlight } from "./Components/Highlight";
export default function Home({ refreshToken }) {
  const [error, setError] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([
    "auth_token",
    "theme",
    "isDark",
  ]);
  const [tenders, setTenders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    platform: "",
    region: "",
  });
  const [infoPopupText, setInfoPopupText] = useState("");
  const [unsuitableID, setUnsuitableID] = useState("");
  const [userStatustes, setUserStatuses] = useState(null);
  const [platformStatustes, setPlatformStatuses] = useState(null);
  const [tendersLoader, setTendersLoader] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isFiltersHidden, setIsFiltersHidden] = useState(true);

  const [inputValue, setInputValue] = useState("");

  const [statusesToggler, setStatusesToggler] = useState(false);

  const fieldsToSearch = ["tender_number", "name", "customer_name"];
  const search = inputValue.toLowerCase();

  const filteredTenders = tenders.filter((item) =>
    fieldsToSearch.some((field) =>
      String(item[field] || "")
        .toLowerCase()
        .includes(search)
    )
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    setIsFiltersHidden(true);
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
    // if (filters.platform && filters.platform === "Подача документов" ) params.set("platform_status", "Подача заявок");
    // console.log(filters.platform)
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
    // console.log(filters.status === "");
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

    setStatusesToggler("");
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
    } finally {
      setStatusesToggler("");
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

  const earaseFilters = (filter) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [filter]: "",
      };
      return updated;
    });
  };

  const [isDark, setIsDark] = useState(false);
  const bodyTag = document.querySelector("body");

  useEffect(() => {
    setIsDark(bodyTag.classList.contains("dark") ? true : false);
  }, [bodyTag, cookies]);

  const [regions, setRegions] = useState(null);

  const getRegions = async () => {
    try {
      const response = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/util/regions",
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
        setRegions(data.regions);
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
    getRegions();
  }, []);

  return (
    <div
      className="flex flex-col overflow-auto"
      onClick={() => {
        setStatusesToggler("");
      }}
    >
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
      <div className={`sticky top-0 z-9 bg-[var(--bg)] flex items-start 	px-[20px] sm:px-[40px] pb-[20px] gap-4  ${screenWidth >= 1440 ? 'flex-col': 'sm:flex-row flex-col'}`}>
        {screenWidth >= 1440 && (
          <div className="w-full">
            <div
              className={`overflow-hidden    gap-[20px] sm:px-[20px]   w-full  `}
            >
              <div className="grid  grid-cols-2  w-full gap-[20px] filters">
                <div className="flex flex-col gap-[20px]">
                  <div className="flex gap-[5px_20px] items-center ">
                    <p className="whitespace-nowrap">Пользовательский статус</p>

                    <button
                      className={`p-[10px] text-[14px] rounded-lg leading-1   border-2 border-[#B05959]
bg-[var(--clean)]/20 hover:bg-[var(--clean)]/50   ${
                        filters.status === ""
                          ? "opacity-0 pointer-events-none"
                          : " opacity-100"
                      }`}
                      onClick={() => earaseFilters("status")}
                    >
                      очистить
                    </button>
                  </div>

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
                              ? "bg-[var(--filters)]"
                              : "bg-[var(--main)]/10 hover:bg-[var(--filters)]/60"
                          } border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item`}
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
                <div className="flex flex-col gap-[20px] ">
                  <div className="flex gap-[5px_20px] items-center flex-wrap">
                    <p className="whitespace-nowrap">Статус платформы</p>

                    <button
                      className={`p-[10px] text-[14px] rounded-lg leading-1   border-2 border-[#B05959]
bg-[var(--clean)]/20 hover:bg-[var(--clean)]/50  ${
                        filters.platform === ""
                          ? "opacity-0 pointer-events-none"
                          : " opacity-100"
                      }`}
                      onClick={() => earaseFilters("platform")}
                    >
                      очистить
                    </button>
                  </div>

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
                              ? "bg-[var(--filters)]"
                              : "bg-[var(--main)]/10 hover:bg-[var(--filters)]/60"
                          } border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item `}
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
            </div>
      
          </div>
        )}

        <input
          type="search"
          className="bg-[var(--lots)] rounded-lg p-[10px_15px_10px_32px]  w-full search_input border-1 border-transparent focus-visible:border-[var(--main)]  focus-visible:bg-[transparent] "
          placeholder="Поиск по названию тендера, заказчику или ID"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {screenWidth < 1440 && (
          <div className="">
            <div
              className={`overflow-hidden flex flex-col    gap-[20px] sm:px-[20px]   w-full  ${
                isFiltersHidden ? "max-h-[0px] " : "max-h-[900px] pb-[20px] "
              } `}
            >
              <div className="grid   gap-[20px] filters">
                <div className="flex flex-col gap-[20px]">
                  <div className="flex gap-[5px_20px] items-center ">
                    <p className="whitespace-nowrap">Пользовательский статус</p>

                    <button
                      className={`p-[10px] text-[14px] rounded-lg leading-1   border-2 border-[#B05959]
bg-[var(--clean)]/20 hover:bg-[var(--clean)]/50   ${
                        filters.status === ""
                          ? "opacity-0 pointer-events-none"
                          : " opacity-100"
                      }`}
                      onClick={() => earaseFilters("status")}
                    >
                      очистить
                    </button>
                  </div>

                  <ul className="flex gap-[10px] flex-wrap">
                    {/* <li className="w-full border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap">

  {filters.status === '' ? 'Не выбрано' : filters.status}

</li> */}

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
                              ? "bg-[var(--filters)]"
                              : "bg-[var(--main)]/10 hover:bg-[var(--filters)]/60"
                          } border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item`}
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
                <div className="flex flex-col gap-[20px] ">
                  <div className="flex gap-[5px_20px] items-center flex-wrap">
                    <p className="whitespace-nowrap">Статус платформы</p>

                    <button
                      className={`p-[10px] text-[14px] rounded-lg leading-1   border-2 border-[#B05959]
bg-[var(--clean)]/20 hover:bg-[var(--clean)]/50  ${
                        filters.platform === ""
                          ? "opacity-0 pointer-events-none"
                          : " opacity-100"
                      }`}
                      onClick={() => earaseFilters("platform")}
                    >
                      очистить
                    </button>
                  </div>

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
                              ? "bg-[var(--filters)]"
                              : "bg-[var(--main)]/10 hover:bg-[var(--filters)]/60"
                          } border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item `}
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
            </div>
            <div
              className="showFilters rounded-lg p-[10px_15px] cursor-pointer whitespace-nowrap w-[-webkit-fill-available] text-center bg-[var(--bg2)] flex gap-[5px] justify-center items-center "
              onClick={() => setIsFiltersHidden(!isFiltersHidden)}
            >
              <p className="text-[var(--color)]">Фильтры</p>
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
                      stroke="var(--color)"
                      strokeWidth="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 10.5L7 1.5"
                      stroke="var(--color)"
                      strokeWidth="1.4"
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
                      stroke="var(--color)"
                      strokeWidth="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 1.50005L7 10.5"
                      stroke="var(--color)"
                      strokeWidth="1.4"
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
        )}
      </div>

      <div className="flex flex-col gap-[30px] p-[20px] ">
        {tendersLoader ? (
          <div className="m-auto">
            <Loader isFull={false} color="var(--main)" />
          </div>
        ) : filteredTenders.length === 0 ? (
          <p className="text-[24px] text-center">
            К сожалению, по данным фильтрам тендера не найдены :(
          </p>
        ) : filteredTenders.length !== 0 ? (
          <div className=" ">
            <div className=" flex flex-col gap-[30px] 	sm:p-[20px] ">
              {filteredTenders.map((item, index) => (
                <div
                  className="bg-[var(--bg2)] shadow-[0px_0px_18px_1px_rgba(0,_0,_0,_0.1)] p-[30px] rounded-lg relative flex flex-col gap-[30px] card "
                  key={index}
                >
                  <div className=" absolute  top-[-10px] left-[-10px] flex gap-[10px] ">
                    {!isDark ? (
                      <div
                        className={`${
                          item.status === "Подача заявок"
                            ? "bg-[#f7ffd7] text-[#817925] border-[#dbd415]"
                            : item.status === "Работа комиссии"
                            ? "bg-[#ECECEC] text-[#545454] border-[#707070]"
                            : item.status === "Завершен"
                            ? "bg-[#E4FFD7] text-[#3D6821] border-[#5FB059]"
                            : "bg-[#FFD7D7] text-[#682121] border-[#B05959]"
                        } border-2 rounded-2xl w-fit p-[0_15px] tag `}
                      >
                        {item.status}
                      </div>
                    ) : (
                      <div
                        className={`${
                          item.status === "Подача заявок"
                            ? "bg-[#181800] text-[#dbd415] border-[#dbd415]"
                            : item.status === "Работа комиссии"
                            ? "bg-[#1b1717] text-[#968a8a] border-[#707070]"
                            : item.status === "Завершен"
                            ? "bg-[#0e100d] text-[#5FB059] border-[#5FB059]"
                            : "bg-[#140909] text-[#B05959] border-[#B05959]"
                        } border-2 rounded-2xl w-fit p-[0_15px] tag `}
                      >
                        {item.status}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col ">
                    <div className="flex sm:gap-10 sm:justify-between items-start sm:flex-row flex-col-reverse">
                      <p className="text-2xl font-medium  mb-[30px]">
                        <Highlight text={item.name} highlight={inputValue} />
                      </p>

                      <div className="flex gap-5 items-center self-end sm:self-auto">
                        {!isDark ? (
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
                              : item.user_status === "unsuitable"
                              ? "Не подходящий"
                              : "В работе"}
                          </div>
                        ) : (
                          <div
                            className={`${
                              item.user_status === "not_reviewed"
                                ? "bg-[#181800] text-[#dbd415] border-[#dbd415]"
                                : item.user_status === "taken_into_work"
                                ? "bg-[#1b1717] text-[#968a8a] border-[#707070]"
                                : item.user_status === "suitable"
                                ? "bg-[#0e100d] text-[#5FB059] border-[#5FB059]"
                                : "bg-[#140909] text-[#B05959] border-[#B05959]"
                            } border-2 rounded-2xl w-fit p-[0_15px]  tag`}
                          >
                            {item.user_status === "not_reviewed"
                              ? "Не рассмотрен"
                              : item.user_status === "suitable"
                              ? "Подходящий"
                              : item.user_status === "unsuitable"
                              ? "Не подходящий"
                              : "Взят в работу"}
                          </div>
                        )}

                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Dots
                            onClick={() =>
                              setStatusesToggler(
                                statusesToggler !== item.tender_id
                                  ? item.tender_id
                                  : statusesToggler === item.tender_id
                                  ? ""
                                  : ""
                              )
                            }
                            className="item-svg w-[35px] h-[35px] rounded-2xl cursor-pointer  p-[10px] hover:bg-[var(--main)]/20"
                          />

                          <div
                            className={`
    absolute bg-[var(--lots)] p-2 rounded-lg right-0 top-10 
    border border-[var(--main)] z-4
     

    ${
      statusesToggler === item.tender_id
        ? "opacity-100 scale-100 pointer-events-auto"
        : "opacity-0 scale-90 pointer-events-none"
    }
  `}
                          >
                            <div className=" flex  flex-col    gap-[5px] btn-wrapper ">
                              <button
                                onClick={() =>
                                  markAsSuitable(item.user_tender_id)
                                }
                                className={`${
                                  item.user_status === "suitable"
                                    ? "bg-[var(--main)]/75 text-[var(--bg2)] active pointer-events-none"
                                    : "bg-[var(--main)]/0 hover:bg-[var(--main)]/20 text-[var(--main)]"
                                } button-suitable flex items-center  gap-[15px] rounded-[5px] p-[10px] text-[20px] whitespace-nowrap w-full`}
                              >
                                <LikeIcon className="item-button-svg" />
                                Подходящий
                              </button>

                              <button
                                onClick={() => {
                                  setStatusesToggler("");

                                  setUnsuitableID(item.user_tender_id);
                                }}
                                className={`${
                                  item.user_status === "unsuitable"
                                    ? "bg-[var(--main)]/75 text-[var(--bg2)] active pointer-events-none"
                                    : "bg-[var(--main)]/0 hover:bg-[var(--main)]/20 text-[var(--main)]"
                                } button-suitable flex items-center  gap-[15px] rounded-[5px] p-[10px] text-[20px] whitespace-nowrap w-full`}
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
                                    ? "bg-[var(--main)]/75 text-[var(--bg2)] active pointer-events-none"
                                    : "bg-[var(--main)]/0 hover:bg-[var(--main)]/20 text-[var(--main)]"
                                } button-suitable flex items-center  gap-[15px] rounded-[5px] p-[10px] text-[20px] whitespace-nowrap w-full`}
                              >
                                <WorkImg className="item-button-svg" />В работу
                              </button>

                              <a
                                href={item.link}
                                className={`bg-[var(--main)]/0 hover:bg-[var(--main)]/20 text-[var(--main)] button-suitable flex items-center  gap-[15px] rounded-[5px] p-[10px] text-[20px] whitespace-nowrap w-full button-suitable`}
                              >
                                <LinkSvg className="item-svg item-button-svg" />
                                Ссылка на тендер
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between w-fit items-center flex-wrap gap-[10px_50px]  card-basic">
                      <div
                        onClick={() => copyToClipboard(item.tender_number)}
                        className="flex gap-[5px] text-[var(--main)] items-center cursor-pointer group"
                      >
                        <CopySvg className="item-svg w-[15px]" />

                        <p className="group-hover:text-[var(--main)] text-[var(--main)]">
                          <Highlight
                            text={item.tender_number}
                            highlight={inputValue}
                          />
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className=" text-xl font-extrabold">
                          {getFinalAmount(item.lots)}{" "}
                          {item.lots[0].currency || "BYN"}
                        </p>
                      </div>

                      <div className="flex gap-[5px] items-center">
                        <WatchSvg className="item-svg w-[18px]" />

                        <p className="text-xl text-[var(--main)]">
                          {getRemDays(item.end_date_2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className=" grid grid-cols-[1fr_1fr] gap-[30px] items-end tender-main">
                    <div className="">
                      <p className="text-m opacity-60 col-span-full ">
                        {" "}
                        Заказчик:
                      </p>
                      <p className="card_info-item col-span-full mb-[15px]">
                        <Highlight
                          text={item.customer_name}
                          highlight={inputValue}
                        />
                      </p>
                      <p className="text-m opacity-60 col-span-full">
                        Платформа:
                      </p>
                      <p className="card_info-item col-span-full  mb-[15px]">
                        {item.platform.name}
                      </p>
                      <p className="text-m opacity-60 col-span-full">
                        Даты подачи:
                      </p>
                      <p className="card_info-item col-span-full  mb-[15px]">
                        {formatDateOnly(item.start_date)} -{" "}
                        {formatDateOnly(item.end_date)}
                      </p>
                    </div>
                    <LotsWrap lots={item.lots} index={index} isDark={isDark} />
                  </div>

                  {/* <div className=" flex      gap-[15px] pt-[15px] btn-wrapper ">
                    <button
                      onClick={() => markAsSuitable(item.user_tender_id)}
                      className={`${
                        item.user_status === "suitable"
                          ? "bg-[var(--main)]/75 text-[var(--bg2)] active pointer-events-none"
                          : "bg-[var(--main)]/25 hover:bg-[var(--main)]/40 text-[var(--main)]"
                      } button-suitable flex items-center justify-center gap-[5px] rounded-xl p-[10px_25px] text-[20px] whitespace-nowrap w-full  sm:w-[calc(50%-7.5px)] min-w-[200px] `}
                    >
                      <LikeIcon className="item-button-svg" />
                      Подходящий
                    </button>

                    <button
                      onClick={() => setUnsuitableID(item.user_tender_id)}
                      className={`${
                        item.user_status === "unsuitable"
                          ? "bg-[var(--main)]/75 text-[var(--bg2)] active pointer-events-none"
                          : "bg-[var(--main)]/25 hover:bg-[var(--main)]/40 text-[var(--main)]"
                      } button-suitable flex items-center justify-center gap-[5px] rounded-xl p-[10px_25px] text-[20px] whitespace-nowrap w-full sm:w-[calc(50%-7.5px)] min-w-[200px] `}
                    >
                      <Dislike className="item-button-svg" />
                      Не подходящий
                    </button>

                    <button
                      onClick={() => MarkAsTakenIntoWork(item.user_tender_id)}
                      className={`${
                        item.user_status === "taken_into_work"
                          ? "bg-[var(--main)]/75 text-[var(--bg2)] active pointer-events-none"
                          : "bg-[var(--main)]/10 hover:bg-[var(--main)]/20 text-[var(--main)] border-[var(--main)]"
                      } button-suitable  flex w-full items-center justify-center gap-[5px] rounded-xl border-2 p-[10px_25px] text-[20px] whitespace-nowrap`}
                    >
                      <WorkImg className="item-button-svg" />В работу
                    </button>
                  </div> */}
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-3 py-4">
              <button
                onClick={onPrev}
                disabled={page === 1}
                className="px-3 py-1 border-2 border-[var(--main)] rounded-lg disabled:opacity-50  hover:bg-[var(--bg2)]"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => onSelectPage(p)}
                    className={`px-3 py-1 border-2 border-[var(--main)] rounded-lg ${
                      p === page
                        ? "bg-[var(--main)] text-white"
                        : " hover:bg-[var(--bg2)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}

              <button
                onClick={onNext}
                disabled={page === totalPages}
                className="px-3 py-1 border-[var(--main)] border-2 rounded-lg disabled:opacity-50  hover:bg-[var(--bg2)]"
              >
                →
              </button>
            </div>
          </div>
        ) : (
          <div className="m-auto">
            <Loader isFull={false} color={"var(--main)"} />
          </div>
        )}
      </div>
    </div>
  );
}
