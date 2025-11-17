import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Error from "./components/Error/Error";

//Layouts
import RootLayout from "./layouts/RootLayout/RootLayout";
import LandingLayout from "./layouts/LandingLayout/LandingLayout";
import UserLayout from "./layouts/UserLayout/UserLayout";

//Layout childrens
import landingChildrens from "./layouts/LandingLayout/childrens";
import userChildrens from "./layouts/UserLayout/childrens";


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
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
    ],
  },
  {
    path: "*",
    element: <Error />
  }
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;