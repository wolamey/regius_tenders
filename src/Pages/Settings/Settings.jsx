import React, { useEffect, useState } from "react";
import useUserInfo from "../../hooks/useUserInfo";
import InputText from "../../Components/InputText/InputText";
import Loader from "../../Components/Loader/Loader";
import { useCookies } from "react-cookie";
import { useLogout } from "../../hooks/useLogout";
import InfoPopup from "../../Components/InfoPopup/InfoPopup";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import { notify } from "../../utils/notify";
import { tryProtectedRequest } from "../../utils/tryProtectedRequest";

export default function Settings({ refreshToken }) {
  const { userInfo, error, setError, refreshUserInfo } =
    useUserInfo(refreshToken);
  if (error) setError(error);


  const logout = useLogout();

  const [filters, setFilters] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);
  const [loader, setLoader] = useState(false);
  const [info, setInfo] = useState("");
  const [addInfo, setAddInfo] = useState(false);
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
      // console.log(userInfo);
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

      const { data, response } = await tryProtectedRequest({
        url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
        method: "PATCH",
        body: sendData,
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({
          title: "Ошибка",
          message: "Ошибка обновления данных",
          type: "danger",
        });
        return;
      }

      notify({
        title: "Успешно",
        message: "Данные обновлены",
        type: "success",
      });

      setAddInfo(false);
      refreshUserInfo();
    } catch (err) {
      notify({
        title: "Ошибка",
        message: "Произошла сетевая ошибка",
        type: "danger",
      });
    } finally {
      setLoader(false);
    }
  };

  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Update email

  const updateEmail = async () => {
    setLoader(true);
    try {
      const { data, response } = await tryProtectedRequest({
        url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
        method: "PATCH",
        body: { email: newEmail },
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({
          title: "Ошибка",
          message: data.message || "Ошибка обновления email",
          type: "danger",
        });
        return;
      }

      notify({
        title: "Успешно",
        message: "Email успешно обновлен",
        type: "success",
      });

      refreshUserInfo();
      setShowEmailPopup(false);
    } catch (err) {
      notify({
        title: "Ошибка",
        message: "Произошла сетевая ошибка",
        type: "danger",
      });
    } finally {
      setLoader(false);
    }
  };

  // Update password

  const updatePassword = async () => {
    setLoader(true);
    try {
      const { data, response } = await tryProtectedRequest({
        url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
        method: "PATCH",
        body: { password: newPassword },
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({
          title: "Ошибка",
          message: data.message || "Ошибка обновления пароля",
          type: "danger",
        });
        return;
      }

      notify({
        title: "Успешно",
        message: "Пароль успешно обновлен",
        type: "success",
      });

      setShowPasswordPopup(false);
    } catch (err) {
      notify({
        title: "Ошибка",
        message: "Произошла сетевая ошибка",
        type: "danger",
      });
    } finally {
      setLoader(false);
    }
  };

  const [platforms, setPlatforms] = useState([]);

  const getPlatforms = async () => {
    try {
      const response = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/platforms/get_all",
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
        setPlatforms(data);
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
    getPlatforms();
  }, []);




  const [platformsMy, setPlatformsMy] = useState([])

    const updatePlatforms = async () => {
    setLoader(true);
    try {
      const { data, response } = await tryProtectedRequest({
        url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
        method: "PATCH",
        body: { selected_platforms: platformsMy },
        token: cookies.auth_token,
        refreshToken,
        logout,
      });

      if (!response.ok) {
        notify({
          title: "Ошибка",
          message: data.message || "Ошибка обновления email",
          type: "danger",
        });
        return;
      }

      notify({
        title: "Успешно",
        message: "Email успешно обновлен",
        type: "success",
      });

      refreshUserInfo();
      setShowEmailPopup(false);
    } catch (err) {
      notify({
        title: "Ошибка",
        message: "Произошла сетевая ошибка",
        type: "danger",
      });
    } finally {
      setLoader(false);
    }
  };


  return (
    <div className="flex flex-col gap-[40px] p-[20px]">
      {loader && <Loader isFull={true} />}

      {/* {info !== "" && <InfoPopup text={info} setInfo={setInfo} />} */}

      {error !== "" && <ErrorPopup text={errorPop} setError={setErrorPop} />}
      {showEmailPopup && (
        <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[var(--main)]/50 dark:bg-[var(--main)]/10 z-99 h-screen flex">
          <div className="bg-[var(--bg)] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[20px]">
            <h3 className="text-2xl">Новый email</h3>
            <InputText
              placeholder="Введите новый email"
              value={newEmail}
              type="text"
              isRequired={true}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEmailPopup(false)}
                className="px-4 py-2 rounded-xl bg-[var(--main)]/25 text-[var(--main)] hover:bg-[var(--main)]/40"
              >
                Отмена
              </button>
              <button
                onClick={updateEmail}
                className="px-4 py-2 rounded-xl bg-[var(--main)]/90 text-white hover:bg-[var(--main)]"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordPopup && (
        <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[var(--main)]/50 dark:bg-[var(--main)]/10   z-99 h-screen flex">
          <div className="bg-[var(--bg)] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[20px]">
            <h3 className="text-2xl">Новый пароль</h3>
            <InputText
              placeholder="Введите новый пароль"
              value={newPassword}
              type="password"
              isRequired={true}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="px-4 py-2 rounded-xl bg-[var(--main)]/25 text-[var(--main)] hover:bg-[var(--main)]/40"
              >
                Отмена
              </button>
              <button
                onClick={updatePassword}
                className="px-4 py-2 rounded-xl bg-[var(--main)]/90 text-white hover:bg-[var(--main)]"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
      {userInfo ? (
        <>
          <div className="flex flex-col gap-[30px]">
            <p className="text-3xl font-medium ">Учетные данные</p>

            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-col ">
                <p className="text-[16px] opacity-45">Название компании:</p>
                <p className="text-[22px] leading-6 settings_item_info">
                  {userInfo.company_name}
                </p>
              </div>
              <div className="flex flex-col ">
                <p className="text-[16px] opacity-45">Номер телефона</p>
                <p className="text-[22px] leading-6 settings_item_info">
                  {userInfo.phone_number}
                </p>
              </div>
              <div className="flex flex-col ">
                <p className="text-[16px] opacity-45">Дата регистрации</p>
                <p className="text-[22px] leading-6 settings_item_info">
                  {userInfo.registration_date}
                </p>
              </div>
              <div className="flex flex-col ">
                <p className="text-[16px] opacity-45">Email</p>
                <p className="text-[22px] leading-6 settings_item_info">
                  {userInfo.email}
                </p>
              </div>

              <div className="flex gap-[0px_20px] flex-wrap">
                <button
                  className={`p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] mt-[10px]`}
                  onClick={() => {
                    setNewEmail(userInfo.email);
                    setShowEmailPopup(true);
                  }}
                >
                  Изменить email
                </button>

                <button
                  className={`p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] mt-[10px]`}
                  onClick={() => setShowPasswordPopup(true)}
                >
                  Изменить пароль
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[30px]">
            <p className="text-3xl font-medium ">Выбранные платформы</p>
            <div className="flex gap-5">
              {userInfo.platforms.map((item, index) => (
                <div
                  className="bg-[var(--main)]/10  border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item flex flex-col gap-3 "
                  key={index}
                >
                  <div className="">
                    <p className="text-xs opacity-60 col-span-full ">
                      Название:
                    </p>
                    <p className="card_info-item col-span-full uppercase">
                      {item.name}
                    </p>
                  </div>

                  <div className="">
                    <p className="text-xs opacity-60 col-span-full ">Регион:</p>
                    <p className="card_info-item col-span-full uppercase">
                      {item.region}
                    </p>
                  </div>
                </div>
              ))}

              {platforms && platforms.length > userInfo.platforms.length ? (
                <div className="">
                  <div className="bg-[var(--main)]/10 hover:bg-[var(--main)]/30  border-2 border-[var(--main)] rounded-2xl p-[7px_15px] cursor-pointer whitespace-nowrap filter_item flex flex-col  gap-2 justify-center items-center h-full">
                    <p className=" col-span-full ">Добавить платформу</p>
                    <div className=" col-span-full uppercase w-[40px] h-[40px] flex justify-center items-center rounded-xl  bg-[var(--main)] p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 35 35"
                        fill="none"
                      >
                        <path
                          d="M17.5 4L17.5 31"
                          stroke="currentColor"
                          stroke-width="7"
                          stroke-linecap="round"
                        />
                        <path
                          d="M31 18.5L4 18.5"
                          stroke="currentColor"
                          stroke-width="7"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[var(--main)]/50 z-999 h-screen flex">
                    <div className="bg-[var(--bg)] max-w-[90vh] m-auto  p-[30px] rounded-2xl flex flex-col gap-[20px] max-h-[90vh] overflow-y-auto w-fit">
                      <p className="text-2xl text-center">Все платформы</p>
                      <div className=" overflow-auto">
                        <div className="flex flex-col gap-1 min-w-[400px] overflow-auto max-h-[80%] ">
                          {platforms.map((item, index) => {
                            const isUserPlatform = userInfo.platforms.some(
                              (p) => p.name === item.name
                            );

                            return (
                              <div className="flex gap-4">
                                <div
                                  className={`
        grid grid-cols-2 gap-10 bg-[var(--bg2)] p-[10px_15px]
        rounded-xl text-sm  w-full
        ${
          isUserPlatform
            ? "border-2 border-[var(--main)]"
            : " border-2 border-transparent  cursor-pointer hover:border-[var(--main)]/50"
        }
      `}
                                  key={index}
                                >
                                  <div className="">
                                    <p className="text-xs opacity-60 col-span-full ">
                                      Название:
                                    </p>
                                    <p className="card_info-item col-span-full uppercase">
                                      {item.name}
                                    </p>
                                  </div>

                                  <div className="">
                                    <p className="text-xs opacity-60 col-span-full ">
                                      Регион:
                                    </p>
                                    <p className="card_info-item col-span-full uppercase">
                                      {item.region}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  className={`${
                                    !isUserPlatform
                                      ? "bg-[var(--main)]/90 text-white hover:bg-[var(--main)]"
                                      : "bg-[#FFD7D7] text-[#682121] border-[#B05959] border-2 hover:bg-[#dd7b7b] "
                                  } p-[7px_15px]  rounded-xl justify-center whitespace-nowrap
     cursor-pointer   min-w-[100px]`}
                                >
                                  {isUserPlatform ? "Удалить" : "Добавить"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Loader isFull={false} color={"var(--main)"} />
              )}
            </div>
          </div>

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
        ? "bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)]"
        : "opacity-50 pointer-events-none bg-[var(--main)]/40 cursor-default"
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
                className={`p-[10px_25px] w-fit rounded-xl text-white justify-center text-[20px] whitespace-nowrap bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)]`}
                onClick={() => setAddInfo(true)}
              >
                Добавить фильтры
              </button>
            </div>
          )}
        </>
      ) : (
        <Loader isFull={true} />
      )}

      {addInfo && (
        <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[var(--main)]/50 dark:bg-[var(--main)]/10 z-99 h-screen flex ">
          <div className="bg-[var(--bg)] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[30px]">
            <p className="text-2xl">Введите информацию фильтров</p>
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
                className="p-[10px_25px] w-full bg-[var(--main)]/25 rounded-xl text-[var(--main)] justify-center text-[20px]   hover:bg-[var(--main)]/40 whitespace-nowrap"
              >
                Отмена
              </button>
              <button
                className={`p-[10px_25px]  rounded-xl text-white justify-center text-[20px] whitespace-nowrap
    ${
      isFiltersChanged
        ? "bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)]"
        : "opacity-50 pointer-events-none bg-[var(--main)]/40 cursor-default"
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
