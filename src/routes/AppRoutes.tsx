import { lazy } from "react";
import { Route, Routes } from "react-router";
import NotFound from "../pages/NotFound";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import VerifyEmail from "@/pages/authPages/VerifyEmail";
import ProtectedRoute from "../components/custom/ProtectedRoute";

const Chat = lazy(() => import("../pages/Chat"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/authPages/Login"));
const Signup = lazy(() => import("../pages/authPages/Signup"));
const ResetPassword = lazy(() => import("../pages/authPages/ResetPassword"));
const ForgotPassword = lazy(() => import("../pages/authPages/ForgotPassword"));
const ResendVerificationEmail = lazy(
  () => import("../pages/authPages/ResendVerificationEmail")
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* this is an app wide layout */}
      <Route element={<AppLayout />}>
        {/* this is a layout for auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/resend-verification-email"
            element={<ResendVerificationEmail />}
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* this is a layout for certain routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* this route catches all unknown routes and renders a not found page */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
