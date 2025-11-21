import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from "../../store/useAuthStore";

const UserLayout = () => {
    const { isLoggedIn, appLoading } = useAuthStore();
    const navigation = useNavigate();

    useEffect(() => {
        if (appLoading) return;

        if (!isLoggedIn) {
            navigation("/login", { replace: true });
        }

    }, [isLoggedIn, appLoading, navigation]);
    return (
        <>
           <Outlet />
        </>
    )
}

export default UserLayout;