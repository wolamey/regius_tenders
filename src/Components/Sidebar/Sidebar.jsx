import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.scss";
import icon1 from "../../assets/images/sidebarIcon1.svg";
import { Link, useLocation } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";
import Loader from "../Loader/Loader";
import ThemeToggler from "./Components/ThemeToggler/ThemeToggler";
import { useCookies } from "react-cookie";
import DayNightToggler from "./Components/DayNightToggler/DayNightToggler";
export default function Sidebar({
  pageName,
  isSideBarHidden,
  setIsSideBarHidden,
  screenWidth, 
  refreshToken,
}) {
  const tabs = [
    {
      image: (
       <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M23.125 16.6718H19.4844C17.9311 16.6718 16.6719 17.931 16.6719 19.4843V23.125M23.125 16.6718C23.125 17.2564 23.0099 17.8352 22.7862 18.3752C22.5625 18.9153 22.2346 19.406 21.8213 19.8193L19.8193 21.8212C19.406 22.2346 18.9153 22.5625 18.3753 22.7861C17.8352 23.0098 17.2564 23.125 16.6719 23.125M23.125 16.6718V5.69454C23.125 4.44947 22.6304 3.25539 21.75 2.37498C20.8696 1.49461 19.6755 1.00002 18.4305 1H5.69453C4.44947 1.00002 3.2554 1.49461 2.37498 2.37498C1.49461 3.25539 1.00002 4.44947 1 5.69454V18.4304C1.00002 19.6755 1.49461 20.8696 2.37498 21.75C3.2554 22.6304 4.44947 23.1249 5.69453 23.125H16.6719M6.53125 17.5937H12.0625M6.53125 6.53126C6.53125 6.53126 13.2735 6.53126 17.5937 6.53126M6.53125 12.0625H17.5937" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
      ),
      name: "Список закупок",
      link: "/",
    },
    {
      image: (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
  <path d="M11.6917 8.37499C9.65526 8.37499 8.00427 10.0259 8.00427 12.0625C8.00427 14.099 9.65526 15.7499 11.6917 15.7499C13.7283 15.7499 15.3793 14.099 15.3793 12.0625C15.3793 10.0259 13.7283 8.37499 11.6917 8.37499ZM22.0418 9.43108L21.0434 10.253C19.9046 11.1905 19.9046 12.9344 21.0434 13.8719L22.0418 14.6939C22.3956 14.9851 22.487 15.4895 22.2579 15.8864L20.2865 19.301C20.0573 19.6979 19.5748 19.871 19.1457 19.7102L17.9346 19.2565C16.5533 18.739 15.043 19.6109 14.8005 21.066L14.5879 22.3416C14.5126 22.7936 14.1215 23.125 13.6632 23.125H9.72035C9.26207 23.125 8.87094 22.7936 8.79562 22.3416L8.58299 21.066C8.34051 19.6109 6.83024 18.739 5.44888 19.2565L4.23791 19.7102C3.80873 19.871 3.32624 19.6979 3.09707 19.301L1.12565 15.8864C0.896519 15.4895 0.987879 14.9851 1.34169 14.6939L2.34013 13.8719C3.47896 12.9344 3.47896 11.1905 2.34013 10.253L1.34169 9.43108C0.987879 9.1398 0.896519 8.63542 1.12565 8.23853L3.09707 4.82393C3.32624 4.42704 3.80873 4.25396 4.23791 4.41475L5.44888 4.8684C6.83024 5.3859 8.34051 4.51399 8.58299 3.05894L8.79562 1.78332C8.87094 1.33131 9.26207 1 9.72035 1H13.6632C14.1215 1 14.5126 1.33131 14.5879 1.78332L14.8005 3.05894C15.043 4.51399 16.5533 5.3859 17.9346 4.8684L19.1457 4.41475C19.5748 4.25396 20.0573 4.42704 20.2865 4.82393L22.2579 8.23853C22.487 8.63542 22.3956 9.1398 22.0418 9.43108Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      ),
      name: "Настройки",
      link: "/settings",
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const loaderRef = useRef(null);

  useEffect(() => {
    if (screenWidth < 1024) setIsSideBarHidden(true);
  }, [path]);

  const { userInfo, error, setError, loader } = useUserInfo(refreshToken);
  if (error) setError(error);
  useEffect(() => {
    setIsLoading(loader ? true : false);
  }, [loader]);
  useEffect(() => {
    if (!isLoading || !loaderRef.current) return;

    const observer = new MutationObserver(() => {
      const hasLoader = loaderRef.current.querySelector(".isNotActiveUser");
      if (!hasLoader) {
        window.location.reload();
      }
    });

    observer.observe(loaderRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [isLoading]);

  const [cookie, setCookie] = useCookies(["theme", 'isDark']);
  const [isDark, setIsDark] = useState(false);
  const bodyTag = document.querySelector("body");

  useEffect(() => {
    setIsDark(bodyTag.classList.contains("dark") ? true : false);
  }, [bodyTag, cookie]);

  return (
    <div className="sidebar">
      <div ref={loaderRef}>
        {isLoading && <Loader isFull={true} isNotActiveUser={true} />}
      </div>
      <div
        className={`${
          isSideBarHidden
            ? "w-0 min-w-0 "
            : "w-[250px] min-w-[250px]  p-[20px] "
        } ${
          isDark && "dark:bg-[var(--main)]/40 "
        } bg-[var(--main)]/100  light:bg-[var(--main)]/100 h-screen  flex flex-col justify-between sidebar transition-all duration-500 ease-in-out overflow-hidden`}
      >
        <div className="">
          <p className="text-3xl text-white mb-[40px]">{pageName}</p>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-[10px] sidebar_item">
              {tabs.map((item, index) => (
                <Link
                  to={item.link}
                  className={`${
                    path === item.link ? "active  bg-[var(--bg)]/20 " : ""
                  } tab_item rounded-lg  flex gap-[12px] items-center p-[10px_20px]   `}
                  key={index}
                >
                  {item.image}
                  <p className=" whitespace-nowrap text-[18px] ">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>

<DayNightToggler />
            {/* <ThemeToggler isDark={isDark}/> */}
          </div>
        </div>

        {/* {userInfo ? (
          <div className="text-white whitespace-nowrap ">
            Осталось дней: {userInfo.remaining_days}
          </div>
        ) : (
          <Loader isFull={false} />
        )} */}
      </div>
    </div>
  );
}
