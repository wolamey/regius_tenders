import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "../Pages/Auth/Auth";
import Register from "../Pages/Register/Register";
import Layout from "../Components/Layout/Layout";
import Home from "../Pages/Home/Home";
import { CookiesProvider } from "react-cookie";
import Settings from "../Pages/Settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <div className="app">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/settings"
              element={
                <Layout pageName={"Настройки"}>
                  <Settings />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout pageName={"Тендеры"}>
                  <Home />
                </Layout>
              }
            />
          </Routes>
        </div>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
