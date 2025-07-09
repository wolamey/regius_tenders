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

export default function Settings({refreshToken}) {
  const { userInfo, error, setError, refreshUserInfo } = useUserInfo(refreshToken);
  if (error) setError(error);
  const logout = useLogout();

  const [filters, setFilters] = useState({});
  const [cookies] = useCookies(["auth_token"]);
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


  return (
    <div className="flex flex-col gap-[40px] p-[20px]">
      {loader && <Loader isFull={true} />}

      {/* {info !== "" && <InfoPopup text={info} setInfo={setInfo} />} */}

      {error !== "" && <ErrorPopup text={errorPop} setError={setErrorPop} />}
      {showEmailPopup && (
        <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-99 h-screen flex">
          <div className="bg-[#DDEDD1] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[20px]">
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
                className="px-4 py-2 rounded-xl bg-[#646d5c]/25 text-[#646d5c] hover:bg-[#646d5c]/40"
              >
                Отмена
              </button>
              <button
                onClick={updateEmail}
                className="px-4 py-2 rounded-xl bg-[#646d5c]/90 text-white hover:bg-[#646d5c]"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
      {showPasswordPopup && (
        <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-99 h-screen flex">
          <div className="bg-[#DDEDD1] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[20px]">
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
                className="px-4 py-2 rounded-xl bg-[#646d5c]/25 text-[#646d5c] hover:bg-[#646d5c]/40"
              >
                Отмена
              </button>
              <button
                onClick={updatePassword}
                className="px-4 py-2 rounded-xl bg-[#646d5c]/90 text-white hover:bg-[#646d5c]"
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
    bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c] mt-[10px]`}
                  onClick={() => {
                    setNewEmail(userInfo.email);
                    setShowEmailPopup(true);
                  }}
                >
                  Изменить email
                </button>

                <button
                  className={`p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[#646d5c]/90 cursor-pointer hover:bg-[#646d5c] mt-[10px]`}
                  onClick={() => setShowPasswordPopup(true)}
                >
                  Изменить пароль
                </button>
              </div>
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
        <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[#646D5C]/50 z-99 h-screen flex ">
          <div className="bg-[#DDEDD1] max-w-[500px] m-auto w-full p-[30px] rounded-2xl flex flex-col items-center gap-[30px]">
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
