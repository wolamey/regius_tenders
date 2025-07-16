import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["auth_token", "refresh_token"]);

  return useCallback(() => {

    localStorage.clear();
    sessionStorage.clear();
   


  
  
    removeCookie("auth_token", { path: "/cabinet" });
    removeCookie("refresh_token", { path: "/cabinet" });

    navigate("/auth");
  }, [removeCookie, navigate]);
}
