// src/Components/RequireAuth/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function RequireAuth() {
  const [cookies] = useCookies(['auth_token']);
  const location = useLocation();
  if (!cookies.auth_token) {
// alert('require')

    // нет токена → на /auth
        localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
     const iframe = document.querySelector('iframe[src*="bitrix"]');
  if (iframe) iframe.remove();

  const script = document.querySelector(
    'script[src^="https://cdn-ru.bitrix24.by/b30573366/crm/site_button/loader_4_myjcfv.js"]'
  );
  if (script) script.remove();

    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  // есть токен → рендерим вложенный маршрут (_Outlet_)
  return <Outlet />;
}
