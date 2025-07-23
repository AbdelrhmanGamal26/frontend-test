import { Outlet } from "react-router";
import PublicRoute from "../components/custom/PublicRoute";

const AuthLayout = () => {
  return (
    <PublicRoute>
      <div className="min-h-dvh flex justify-center items-center bg-black">
        <Outlet />
      </div>
    </PublicRoute>
  );
};

export default AuthLayout;
