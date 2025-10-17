import { Outlet } from "react-router";
import PublicRoute from "../components/custom/PublicRoute";

const AuthLayout = () => {
  return (
    <PublicRoute>
      <div className="min-h-dvh flex justify-center items-center bg-gradient-to-br from-emerald-500 via-green-600 to-yellow-500 dark:from-emerald-900 dark:via-green-950 dark:to-yellow-900 relative overflow-hidden">
        <Outlet />
      </div>
    </PublicRoute>
  );
};

export default AuthLayout;
