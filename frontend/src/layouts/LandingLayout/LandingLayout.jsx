import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from "../../store/useAuthStore";

const LandingLayout = () => {
    const { isLoggedIn, appLoading } = useAuthStore();
    const navigation = useNavigate();

    useEffect(() => {
        if (appLoading) return;

        if (isLoggedIn) {
            navigation("/user", { replace: true });
        }
    }, [isLoggedIn, appLoading, navigation]);
    
    return (
        <>
           <Outlet />
        </>
    )
}

export default LandingLayout;