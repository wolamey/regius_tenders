import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ErrorPopup from "../ErrorPopup/ErrorPopup";
import { useCookies } from "react-cookie";
import useUserInfo from "../../hooks/useUserInfo";

export default function UserInfoLine() {
  const { userInfo, error, setError } = useUserInfo();
  if (error) setError(error);

  return (
    <div className="bg-[#f6fcf2] p-[20px] w-full flex justify-between items-center shadow-2xl/7">
      <div className=""></div>
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
      {userInfo ? (
        <div className="flex items-center gap-[10px] ">
          <svg
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
                stroke-width="1.5"
              />
            </mask>
            <g mask="url(#mask0_16_19)">
              <path
                d="M6 6.93896C6 3.62528 8.68631 0.938965 12 0.938965C15.3137 0.938965 18 3.62528 18 6.93896C18 10.2527 15.3137 12.939 12 12.939C8.68631 12.939 6 10.2527 6 6.93896Z"
                stroke="black"
                stroke-width="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.8483 14.2983C19.9409 14.7838 20.815 15.3584 21.4775 15.9406C22.4876 16.828 23.0625 18.1101 23.0625 19.4546V21.189C23.0625 22.2245 22.2231 23.064 21.1875 23.064H2.8125C1.77698 23.064 0.9375 22.2245 0.9375 21.189V19.4546C0.9375 18.1101 1.51242 16.828 2.52248 15.9406C4.23267 14.438 7.35169 12.939 12 12.939"
                stroke="black"
                stroke-width="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
              />
            </g>
          </svg>

          <p className="">{userInfo.email}</p>
        </div>
      ) : (
        <Loader isFull={false} color="#646D5C" />
      )}
    </div>
  );
}
