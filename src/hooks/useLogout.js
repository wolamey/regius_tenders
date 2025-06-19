import { useCallback } from "react";
import { useCookies } from "react-cookie";

export function useLogout(){
    const [,removeCookie] = useCookies(['auth_token'])
    return useCallback(()=>{
        removeCookie('auth_token', {path:'/'})
        window.location.href = '/auth'
    }, [removeCookie])
}