import React, { useEffect, useState } from "react";
import "./Sidebar.scss";
import icon1 from "../../assets/images/sidebarIcon1.svg";
import { Link, useLocation } from "react-router-dom";
import useUserInfo from "../../hooks/useUserInfo";
import Loader from "../Loader/Loader";
export default function Sidebar({ pageName,isSideBarHidden }) {
  const tabs = [
    {
      image: (
        <svg
          id="img"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_13_6"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="25"
          >
            <path
              d="M23.25 23.2515V0.751465H0.75V23.2515H23.25Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
            />
          </mask>
          <g mask="url(#mask0_13_6)">
            <path
              d="M23.0625 16.6108H19.4219C17.8686 16.6108 16.6094 17.87 16.6094 19.4233V23.064M23.0625 16.6108C23.0625 17.1954 22.9474 17.7742 22.7237 18.3142C22.5 18.8543 22.1721 19.345 21.7588 19.7583L19.7568 21.7602C19.3435 22.1736 18.8528 22.5015 18.3128 22.7251C17.7727 22.9488 17.1939 23.064 16.6094 23.064M23.0625 16.6108V5.6335C23.0625 4.38843 22.5679 3.19436 21.6875 2.31395C20.8071 1.43358 19.613 0.938985 18.368 0.938965H5.63203C4.38697 0.938985 3.1929 1.43358 2.31248 2.31395C1.43211 3.19436 0.937519 4.38843 0.9375 5.6335V18.3694C0.937519 19.6145 1.43211 20.8086 2.31248 21.689C3.1929 22.5694 4.38697 23.0639 5.63203 23.064H16.6094M6.46875 17.5327H12M6.46875 6.47022H17.5312M6.46875 12.0015H17.5312"
              stroke="currentColor"
              stroke-width="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      ),
      name: "Список закупок",
      link: "/",
    },
    {
      image: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <mask
            id="mask0_60_3"
            maskUnits="userSpaceOnUse"
            x="-1"
            y="0"
            width="25"
            height="25"
          >
            <path
              d="M22.9998 23.001V1.00098H0.999756V23.001H22.9998Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
            />
          </mask>
          <g mask="url(#mask0_60_3)">
            <path
              d="M11.9997 8.31346C9.96321 8.31346 8.31222 9.9644 8.31222 12.001C8.31222 14.0375 9.96321 15.6884 11.9997 15.6884C14.0363 15.6884 15.6873 14.0375 15.6873 12.001C15.6873 9.9644 14.0363 8.31346 11.9997 8.31346ZM22.3498 9.36955L21.3514 10.1915C20.2126 11.129 20.2126 12.8729 21.3514 13.8104L22.3498 14.6324C22.7036 14.9236 22.795 15.428 22.5659 15.8249L20.5945 19.2395C20.3653 19.6364 19.8828 19.8095 19.4537 19.6487L18.2426 19.195C16.8613 18.6775 15.351 19.5494 15.1085 21.0045L14.8959 22.2801C14.8206 22.7321 14.4295 23.0635 13.9712 23.0635H10.0283C9.57002 23.0635 9.17889 22.7321 9.10357 22.2801L8.89094 21.0045C8.64846 19.5494 7.13819 18.6775 5.75683 19.195L4.54586 19.6487C4.11668 19.8095 3.63419 19.6364 3.40502 19.2395L1.4336 15.8249C1.20447 15.428 1.29583 14.9236 1.64964 14.6324L2.64808 13.8104C3.78691 12.8729 3.78691 11.129 2.64808 10.1915L1.64964 9.36955C1.29583 9.07827 1.20447 8.5739 1.4336 8.17701L3.40502 4.7624C3.63419 4.36551 4.11668 4.19244 4.54586 4.35323L5.75683 4.80688C7.13819 5.32438 8.64846 4.45246 8.89094 2.99741L9.10357 1.7218C9.17889 1.26979 9.57002 0.938475 10.0283 0.938475H13.9712C14.4295 0.938475 14.8206 1.26979 14.8959 1.7218L15.1085 2.99741C15.351 4.45246 16.8613 5.32438 18.2426 4.80688L19.4537 4.35323C19.8828 4.19244 20.3653 4.36551 20.5945 4.7624L22.5659 8.17701C22.795 8.5739 22.7036 9.07827 22.3498 9.36955Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      ),
      name: "Настройки",
      link: "/settings",
    },
  ];
  const location = useLocation();
  const path = location.pathname;



  const { userInfo, error, setError } = useUserInfo();
  if (error) setError(error);
  // console.log(userInfo);
  return (
    <div className={`${isSideBarHidden? 'w-0 min-w-0 ' : 'w-[250px] min-w-[250px]  p-[20px] '} h-screen bg-[#646D5C] flex flex-col justify-between sidebar transition-all duration-500 ease-in-out overflow-hidden`}>
      
      <div className="">
        <p className="text-3xl text-white mb-[40px]">{pageName}</p>

        <div className="flex flex-col gap-[10px] sidebar_item">
          {tabs.map((item, index) => (
            <Link
              to={item.link}
              className={`${
                path === item.link ? "active  bg-[#77826E] " : ""
              }tab_item rounded-lg group flex gap-[12px] items-center p-[10px_20px] peer  `}
              key={index}
            >
              {item.image}
              <p className="text-white whitespace-nowrap text-[18px] group-hover:text-[#DDEDD1]">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {userInfo ? (
        <div className="text-white whitespace-nowrap ">
          Осталось дней: {userInfo.remaining_days}
        </div>
      ) : (
        <Loader isFull={false} />
      )}
    </div>
  );
}
