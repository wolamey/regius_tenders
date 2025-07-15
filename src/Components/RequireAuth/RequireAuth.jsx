// src/Components/RequireAuth/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function RequireAuth() {
  const [cookies] = useCookies(['auth_token']);
  const location = useLocation();
  if (!cookies.auth_token) {

      

    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  // есть токен → рендерим вложенный маршрут (_Outlet_)
  return <Outlet />;
}
