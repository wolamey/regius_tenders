import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
export function useLogout(){
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie]= useCookies(['auth_token'])
    return useCallback(()=>{
        console.log('logout')
        removeCookie('auth_token', {path:'/regius_tenders'})
            removeCookie('refresh_token',{ path: '/regius_tenders' });

        navigate('/auth');
    }, [removeCookie])
}