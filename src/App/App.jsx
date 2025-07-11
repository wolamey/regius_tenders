import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { ReactNotifications } from "react-notifications-component";

import Auth from "../Pages/Auth/Auth";
import Register from "../Pages/Register/Register";
import Layout from "../Components/Layout/Layout";
import Home from "../Pages/Home/Home";
import Settings from "../Pages/Settings/Settings";
import RequireAuth from "../Components/RequireAuth/RequireAuth";


// Компонент для подгрузки Bitrix24-чата
const BitrixScript = () => {
  useEffect(() => {
    const selector = 
      'script[src^="https://cdn-ru.bitrix24.by/b30573366/crm/site_button/loader_4_myjcfv.js"]';

    // Если скрипта ещё нет — добавляем
    if (!document.querySelector(selector)) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://cdn-ru.bitrix24.by/b30573366/crm/site_button/loader_4_myjcfv.js?" +
        ((Date.now() / 60000) | 0);
      document.body.appendChild(script);
    }

    // При размонтировании — удаляем
    return () => {
      const script = document.querySelector(selector);
      if (script) document.body.removeChild(script);
    };
  }, []);

  return null;
};


const App = () => {
  const [cookies, setCookie] = useCookies(["auth_token", "refresh_token"]);

  // Функция для обновления токена
  const refreshToken = async () => {
    const refresh = cookies.refresh_token;
    if (!refresh) return null;

    try {
      const response = await fetch(
        `https://tendersiteapi.dev.regiuslab.by/v1/user/refresh?refresh_token=${refresh}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok) return null;

      const data = await response.json();
      if (!data) return null;

      setCookie("auth_token", data.access_token, {
        path: "/regius_tenders",
        maxAge: 3600,
      });
      setCookie("refresh_token", data.refresh_token, {
        path: "/regius_tenders",
        maxAge: 86400,
      });

      return data.access_token;
    } catch (err) {
      console.error("Ошибка при обновлении токена:", err);
      return null;
    }
  };

  return (
        <div className="app">
          <ReactNotifications />

          <Routes>
            {/* Публичные страницы */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />

            {/* Защищённые маршруты — только для авторизованных */}
            <Route element={<RequireAuth />}>
              <Route
                path="/"
                element={
                  <>
                    <BitrixScript />
                    <Layout refreshToken={refreshToken} pageName="Тендеры">
                      <Home refreshToken={refreshToken} />
                    </Layout>
                  </>
                }
              />
              <Route
                path="/settings"
                element={
                  <>
                    <BitrixScript />
                    <Layout refreshToken={refreshToken} pageName="Настройки">
                      <Settings refreshToken={refreshToken} />
                    </Layout>
                  </>
                }
              />
            </Route>
          </Routes>
        </div>
  );
};

export default App;
