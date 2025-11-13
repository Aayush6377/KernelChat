import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./components/Error/Error";

//Layouts
import LandingLayout from "./layouts/LandingLayout/LandingLayout";
import UserLayout from "./layouts/UserLayout/UserLayout";

//Layout childrens
import landingChildrens from "./layouts/LandingLayout/childrens";
import userChildrens from "./layouts/UserLayout/childrens";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: landingChildrens,
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: userChildrens,
  },
  {
    path: "*",
    element: <Error />
  }
]);

function App(){
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center text-slate-200 p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;