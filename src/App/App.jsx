import { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Auth from "../Pages/Auth/Auth";
import Register from "../Pages/Register/Register";
import Layout from "../Components/Layout/Layout";
import Home from "../Pages/Home/Home";
import { CookiesProvider, useCookies } from "react-cookie";
import Settings from "../Pages/Settings/Settings";
import { HashRouter } from "react-router-dom";
import { ReactNotifications, Store } from "react-notifications-component";
function App() {
  const [cookies, setCookie] = useCookies(["auth_token", "refresh_token"]);

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
      console.log(data);
      if (!data) {
      console.log("рефреш не получится");

        return;
      }
      setCookie("auth_token", data.access_token, {
        path: "/regius_tenders",
        maxAge: 3600,
      });

      setCookie("refresh_token", data.refresh_token, {
        path: "/regius_tenders",
        maxAge: 86400,
      });

      console.log("рефреш");

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
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/settings"
          element={
            <Layout refreshToken={refreshToken} pageName={"Настройки"}>
              <Settings refreshToken={refreshToken} />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout refreshToken={refreshToken} pageName={"Тендеры"}>
              <Home refreshToken={refreshToken} />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
