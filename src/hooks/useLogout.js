import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["auth_token", "refresh_token"]);

  return useCallback(() => {
    console.log("logout");
    // alert("logout");
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
    console.log(script);
    removeCookie("auth_token", { path: "/regius_tenders" });
    removeCookie("refresh_token", { path: "/regius_tenders" });

    navigate("/auth");
  }, [removeCookie, navigate]);
}
