import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
export function useLogout(){
    const navigate = useNavigate();
    const [,removeCookie] = useCookies(['auth_token'])
    return useCallback(()=>{
        removeCookie('auth_token', {path:'/'})
        removeCookie('auth_token', {path:'/regius_tenders'})
        navigate('/auth');
    }, [removeCookie])
}