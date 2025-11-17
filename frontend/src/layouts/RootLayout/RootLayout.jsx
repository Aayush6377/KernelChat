import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import Loader from "../../components/Loader/Loader";
import { useEffect } from "react";

const RootLayout = () => {
  const { appLoading, checkUserAuth } = useAuthStore();

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center text-slate-200 p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      

      {appLoading ? <Loader /> : <Outlet />}
      
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default RootLayout;