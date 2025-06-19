import React, { useEffect, useState } from "react";
import useUserInfo from "../../hooks/useUserInfo";
import InputText from "../../Components/InputText/InputText";
import Loader from "../../Components/Loader/Loader";
import { useCookies } from "react-cookie";
import { useLogout } from "../../hooks/useLogout";
import InfoPopup from "../../Components/InfoPopup/InfoPopup";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";

export default function Settings() {
  const { userInfo, error, setError, refreshUserInfo } = useUserInfo();
  if (error) setError(error);
  const logout = useLogout();

  const [filters, setFilters] = useState({});
  const [cookies] = useCookies(["auth_token"]);
  const [loader, setLoader] = useState(false);
  const [info, setInfo] = useState("");
  const [addInfo, setAddInfo] = useState(false)
  const [initialFilters, setInitialFilters] = useState({});
  const [initialAccData, setInitialAccData] = useState({
    email: "",
    password: "",
    phone_number: "",
  });
  const [userAccountData, setUserAccountData] = useState({
    email: "",
    password: "",
    phone_number: "",
  });
  const [errorPop, setErrorPop] = useState("");

  const [filterSum, setFilterSum] = useState("");
  useEffect(() => {
    if (userInfo?.filter) {
      const sum = Object.values(userInfo.filter).join("");
      setFilterSum(sum);

      setFilters(userInfo.filter);
      setInitialFilters(userInfo.filter);
    }
  }, [userInfo]);

  const isFiltersChanged =
    JSON.stringify(filters) !== JSON.stringify(initialFilters);

  const isAccDataChanged =
    JSON.stringify(userAccountData) !== JSON.stringify(initialAccData);

  useEffect(() => {
    if (userInfo) {
      console.log(userInfo);
      setUserAccountData({
        email: userInfo.email || "",
        password: "",
        phone_number: userInfo.phone_number || "",
      });
      setInitialAccData({
        email: userInfo.email || "",
        password: "",
        phone_number: userInfo.phone_number || "",
      });
    }
  }, [userInfo]);

const updateUserInfo = async () => {
  setLoader(true);

  try {
    const sendData = {
      email: userAccountData.email,
      password: userAccountData.password,
      phone_number: userAccountData.phone_number,
      filter: filters,
    };

    const response = await fetch(
      "https://tenderstest.dev.regiuslab.by/v1/user/me",
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.auth_token}`,
        },
        body: JSON.stringify(sendData),
      }
    );

    const data = await response.json();

    if (response.status === 498 || response.status === 403) {
      return logout();
    }

    if (response.ok) {
      setInfo("Данные успешно обновлены");
      setAddInfo(false);
      refreshUserInfo();
    } else {
      setError("Ошибка обновления данных");
    }
  } catch (err) {
    setError("Произошла сетевая ошибка"); 
  } finally {
    setLoader(false); 
  }
};


  return (
    <div className="flex flex-col gap-[40px]">
      {loader && <Loader isFull={true} />}

      {info !== "" && <InfoPopup text={info} setInfo={setInfo} />}

      {error !== "" && <ErrorPopup text={errorPop} setError={setErrorPop} />}

      {userInfo ? (
        <>
          {filterSum !== "" ? (
            <div className="flex flex-col gap-[30px]">
              <p className="text-3xl font-medium ">Фильтр</p>
              <div className="flex flex-col gap-[10px]">
                {Object.entries(filters).map(([key, value]) => (
                  <div className="flex flex-col gap-[5px]" key={key}>
                    <p className="">{key}</p>
                    <InputText
                      placeholder={""}
                      value={value}
                      type="text"
                      isRequired={false}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <button
                className={`p-[10px_25px] w-fit rounded-xl text-white justify-center text-[20px] whitespace-nowrap
    ${
      isFiltersChanged
        ? "bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c]"
        : "opacity-50 pointer-events-none bg-[#646d5c]/40 cursor-default"
    }`}
                onClick={isFiltersChanged ? updateUserInfo : undefined}
              >
                Обновить фильтры
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[20px]">
              <p className="text-3xl font-medium ">
                Похоже что фильтры еще не заданы, но вы можете это исправить!
              </p>

              <button
                className={`p-[10px_25px] w-fit rounded-xl text-white justify-center text-[20px] whitespace-nowrap bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c]
   `}
                onClick={()=> setAddInfo(true)}
              >
                Добавить фильтры
              </button>
            </div>
          )}
          <div className="flex flex-col gap-[30px]">
            <p className="text-3xl font-medium ">Учетные данные</p>
            <div className="flex flex-col gap-[20px]">
              {Object.entries(userAccountData).map(([key, value]) => (
                <InputText
                  key={key}
                  placeholder={
                    key === "password"
                      ? "Введите новый пароль"
                      : key === "phone_number"
                      ? "Номер телефона"
                      : "Email"
                  }
                  value={value}
                  type={key !== "password" ? "text" : "password"}
                  isRequired={false}
                  onChange={(e) =>
                    setUserAccountData({
                      ...userAccountData,
                      [key]: e.target.value,
                    })
                  }
                />
              ))}
            </div>

            <butto
              className={`p-[10px_25px] w-fit rounded-xl text-white justify-center text-[20px] whitespace-nowrap
    ${
      isAccDataChanged
        ? "bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c]"
        : "opacity-50 pointer-events-none bg-[#646d5c]/40 cursor-default"
    }`}
              onClick={updateUserInfo}
            >
              Обновить учетные данные
            </butto>
          </div>
        </>
      ) : (
        <Loader isFull={true} />
      )}


{addInfo && (

     <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-999 h-screen flex ">
        <div className="bg-[#DDEDD1] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[30px]">

          <p className="text-2xl">
          Введите информацию фильтров
        </p>
              <div className="flex flex-col gap-[10px] w-full">

          {Object.entries(filters).map(([key, value]) => (
            <div className="flex flex-col w-full gap-[5px]" key={key}>
              <p className="">{key}</p>
              <InputText
                placeholder={""}
                value={value}
                type="text"
                isRequired={false}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

          <div className="grid grid-cols-2 gap-[10px] w-full">
          <button
            onClick={() => setAddInfo(false)}
            className="p-[10px_25px] w-full bg-[#646d5c]/25 rounded-xl text-[#646d5c] justify-center text-[20px]   hover:bg-[#646d5c]/40 whitespace-nowrap"
          >
            Отмена
          </button>
          <button
             className={`p-[10px_25px]  rounded-xl text-white justify-center text-[20px] whitespace-nowrap
    ${
      isFiltersChanged
        ? "bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c]"
        : "opacity-50 pointer-events-none bg-[#646d5c]/40 cursor-default"
    }`}
                onClick={isFiltersChanged ? updateUserInfo : undefined}
              
          >
            Отправить
          </button>
        </div>
        </div>
      </div>
)}
   
    </div>
  );
}
