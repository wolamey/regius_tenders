// src/hooks/useValidToken.js
import { useCookies } from "react-cookie";

export function useValidToken() {
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token", "refresh_token"]);

  const getValidToken = async (status) => {
    if (status !== 404) return cookies.auth_token;

    const refreshToken = cookies.refresh_token;
    if (!refreshToken) return null;

    try {
      const response = await fetch(
        `https://tendersiteapi.dev.regiuslab.by/v1/user/refresh?refresh_token=${refreshToken}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();

      // console.log(data)
      setCookie("auth_token", data.access_token, {
        path: "/cabinet",
        maxAge: 3600,
      });

      setCookie("refresh_token", data.refresh_token, {
        path: "/cabinet",
        maxAge: 86400,
      });

      return data.access_token;
    } catch (err) {
      // console.error("Ошибка обновления токена:", err);
      return null;
    }
  };

  return { getValidToken };
}
