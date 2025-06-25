import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLogout } from "./useLogout";
import { useNavigate } from "react-router-dom";

export default function useUserInfo() {
  const [cookies] = useCookies(["auth_token"]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0)

  const refreshUserInfo = ()=> setVersion((v)=> v+1)
const logout = useLogout()
const navigate = useNavigate()
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch("https://tenderstest.dev.regiuslab.by/v1/user/me", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${cookies.auth_token}`,
          },
        });

        const data = await response.json();
// console.log(data)
        if (response.status === 498 || response.status === 403 ) {
          logout()
          return;
        }

        if (!response.ok) {
          setError(data.detail || "Ошибка получения пользователя");
        } else {
          setUserInfo(data);
        }
      } catch (err) {
        setError("Ошибка сети");
      }
    };

    getUserInfo();
  }, [cookies.auth_token,   version]);

  return { userInfo, error, setError, refreshUserInfo };
}
