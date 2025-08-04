import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ErrorPopup from "../ErrorPopup/ErrorPopup";
import { useCookies } from "react-cookie";
import useUserInfo from "../../hooks/useUserInfo";
import DayNightToggler from "../Sidebar/Components/DayNightToggler/DayNightToggler";
import { Link, useLocation } from "react-router-dom";

export default function UserInfoLine({
  isSideBarHidden,
  setIsSideBarHidden,
  screenWidth,
  refreshToken,
}) {
  const { userInfo, error, setError } = useUserInfo(refreshToken);
  if (error) setError(error);
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();

  const path = location.pathname;

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

     {
      image: (
<svg xmlns="http://www.w3.org/2000/svg" width="27" height="25" viewBox="0 0 27 25" fill="none">
  <path d="M16.5493 14.1494L15.3334 10.8467C15.0587 10.1006 14.3415 9.5684 13.5 9.5684C12.6585 9.5684 11.9413 10.1006 11.6665 10.8467L10.4506 14.1494C10.1758 14.8956 9.45867 15.4278 8.61717 15.4278C7.77567 15.4278 7.05848 14.8956 6.78373 14.1494L5.76312 10.8467C5.48832 10.1006 4.77118 9.5684 3.92968 9.5684C2.85102 9.5684 1.97656 10.4428 1.97656 11.5215V21.2871C1.97656 22.3658 2.85102 23.2402 3.92968 23.2402H23.0703C24.149 23.2402 25.0234 22.3658 25.0234 21.2871V11.5215C25.0234 10.4428 24.149 9.5684 23.0703 9.5684C22.2287 9.5684 21.5116 10.1006 21.2368 10.8467L20.2162 14.1494C19.9415 14.8956 19.2243 15.4278 18.3828 15.4278C17.5412 15.4278 16.8241 14.8956 16.5493 14.1494Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5.8828 3.70899C5.8828 4.78765 5.00834 5.66211 3.92968 5.66211C2.85102 5.66211 1.97656 4.78765 1.97656 3.70899C1.97656 2.63033 2.85102 1.75587 3.92968 1.75587C5.00834 1.75587 5.8828 2.63033 5.8828 3.70899Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15.4531 3.70899C15.4531 4.78765 14.5787 5.66211 13.5 5.66211C12.4213 5.66211 11.5468 4.78765 11.5468 3.70899C11.5468 2.63033 12.4213 1.75587 13.5 1.75587C14.5787 1.75587 15.4531 2.63033 15.4531 3.70899Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25.0234 3.70899C25.0234 4.78765 24.149 5.66211 23.0702 5.66211C21.9915 5.66211 21.1171 4.78765 21.1171 3.70899C21.1171 2.63033 21.9915 1.75587 23.0702 1.75587C24.149 1.75587 25.0234 2.63033 25.0234 3.70899Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      ),
      name: "PRO",
      link: "/pro",
    },
  ];
  return (
    <div className="bg-[var(--bg2)]  w-full  shadow-2xl/5 z-99 ">
    

      <div className="p-[20px_40px] flex justify-between items-center max-w-[1400px] m-auto">
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
        {screenWidth < 1024 && (
          <button
            className={`hamburger hamburger--spin ${
              !isSideBarHidden ? "is-active" : ""
            }`}
            type="button"
            onClick={() => {
              setIsActive(!isActive);
              setIsSideBarHidden(!isSideBarHidden);
            }}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        )}


        {screenWidth >= 1024 && (

<>

      <DayNightToggler />

      <div className="flex  gap-[10px] sidebar_item">
        {tabs.map((item, index) => (
          <Link
            to={item.link}
            className={`${
              path === item.link ? "active  bg-[var(--bg)] " : " hover:bg-[var(--bg)]/50"
            } tab_item rounded-lg  flex gap-[12px] items-center p-[10px_20px]  text-[var(--main)] `}
            key={index}
          >
            {item.image}
            <p className="text-[var(--main)] whitespace-nowrap text-[18px] ">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
      </>
        )}
      {userInfo ? (
        <div className="flex items-center gap-[10px]  ">
          <svg
            className="item-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <mask
              id="mask0_16_19"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="25"
            >
              <path
                d="M23.25 23.2515V0.751465H0.75V23.2515H23.25Z"
                fill="white"
                stroke="white"
                strokeWidth="1.5"
              />
            </mask>
            <g mask="url(#mask0_16_19)">
              <path
                d="M6 6.93896C6 3.62528 8.68631 0.938965 12 0.938965C15.3137 0.938965 18 3.62528 18 6.93896C18 10.2527 15.3137 12.939 12 12.939C8.68631 12.939 6 10.2527 6 6.93896Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.8483 14.2983C19.9409 14.7838 20.815 15.3584 21.4775 15.9406C22.4876 16.828 23.0625 18.1101 23.0625 19.4546V21.189C23.0625 22.2245 22.2231 23.064 21.1875 23.064H2.8125C1.77698 23.064 0.9375 22.2245 0.9375 21.189V19.4546C0.9375 18.1101 1.51242 16.828 2.52248 15.9406C4.23267 14.438 7.35169 12.939 12 12.939"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
            </g>
          </svg>
          <div className="flex flex-col">
            <p className="leading-4">{userInfo.email}</p>
            <p className="text-[12px] leading-4 opacity-70">
              Осталось дней: {userInfo.remaining_days}
            </p>
          </div>
        </div>
      ) : (
        <Loader isFull={false} color="var(--main)" />
      )}
      </div>
    </div>
  );
}
