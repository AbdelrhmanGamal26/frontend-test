import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { RootState } from "../../store";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  console.log(location);

  useEffect(() => {
    if (!user.isLoggedIn && !location.state?.justLoggedOut) {
      toast("You are not logged in. Please login first.");
    }
  }, [user.isLoggedIn, location.state]);

  return user.isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
