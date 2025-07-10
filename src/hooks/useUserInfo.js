import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLogout } from "./useLogout";
import { notify } from "../utils/notify";
import { tryProtectedRequest } from "../utils/tryProtectedRequest";

export default function useUserInfo(refreshToken) {
  const [cookies, setCookie, removeCookie]= useCookies(["auth_token"]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

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

  return { userInfo, error, setError, refreshUserInfo };
}
