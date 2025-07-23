import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { RootState } from "../../store";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  return user.isLoggedIn ? <Navigate to={from} replace /> : children;
};

export default PublicRoute;
