import SignUp from "../../pages/landing/SignUp/SignUp";
import Login from "../../pages/landing/Login/Login";
import Home from "../../pages/landing/Home/Home";

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
    }
];

export default landingChildrens;