import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLogout } from "./useLogout";
import { notify } from "../utils/notify";
import { tryProtectedRequest } from "../utils/tryProtectedRequest";
import Loader from "../Components/Loader/Loader";

export default function useUserInfo(refreshToken) {
  const [cookies, setCookie, removeCookie]= useCookies(["auth_token"]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
const [loader, setLoader] = useState(false)

  const refreshUserInfo = () => setVersion((v) => v + 1);
  const logout = useLogout();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data, response } = await tryProtectedRequest({
          url: "https://tendersiteapi.dev.regiuslab.by/v1/user/me",
          method: "GET",
          token: cookies.auth_token,
          refreshToken,
          logout,
        });

        if (!response.ok) {
          notify({
            title: "Ошибка",
            message: data.detail || "Ошибка получения пользователя",
            type: "danger",
          });
        } else {
          setUserInfo(data);

          if(!data.is_active) {
            setLoader(true)
           notify({
            title: "Вы еще не активированы",
            message: 'Мы активируем ваш аккаунт в течение 24 часов. Пожалуйста, приходите позже.',
            type: "danger",
          duration: 0,

          });
          return 
          }
        }
      } catch (err) {
        notify({
          title: "Ошибка",
          message: "Ошибка сети: " + err,
          type: "danger",
        });
      }
    };

    getUserInfo();
  }, [cookies.auth_token, version]);

  return { userInfo, error, setError, refreshUserInfo, loader };
}
