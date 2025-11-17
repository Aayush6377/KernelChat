import SignUp from "../../pages/landing/SignUp/SignUp";
import Login from "../../pages/landing/Login/Login";
import Home from "../../pages/landing/Home/Home";
import ForgotPassword from "../../pages/landing/ForgotPassword/ForgotPassword";
import ResetPassword from "../../pages/landing/ResetPassword/ResetPassword";

const landingChildrens = [
    {
        index: true,
        element: <Home />
    },
    {
        path: "signup",
        element: <SignUp />
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "reset-password/:token",
        element: <ResetPassword />
    }
];

export default landingChildrens;