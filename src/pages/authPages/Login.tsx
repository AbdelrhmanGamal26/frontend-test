import { Fragment, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Lock, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { RootState } from "../../store";
import { login } from "../../store/userSlice";
import AuthForm from "@/components/shared/AuthForm";
import AuthAction from "@/components/shared/AuthAction";
import CustomButton from "@/components/shared/CustomButton";
import axiosInstance, { setAccessToken } from "../../lib/axios";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import LoginFormHeader from "@/components/custom/LoginFormHeader";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";
import GlassmorphismBackground from "@/components/shared/GlassmorphismBackground";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [user.isLoggedIn, navigate, from]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/login`,
        form
      );

      const { _id, name, email, photo } = res.data.data.user;
      const accessToken = res.data.data.accessToken;

      setAccessToken(accessToken);
      dispatch(login({ userId: _id, name, email, photo, accessToken }));

      // Always check the status after dispatching
      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        navigate(from, { replace: true }); // user goes back to the protected route
        setIsLoading(false);
        toast("login successful!");
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast(error?.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <SuspenseWrapper>
      {/* Glassmorphism background elements */}
      <GlassmorphismBackground />
      <AuthFormContainer authFormHeader={<LoginFormHeader />}>
        <AuthForm onSubmit={submitHandler}>
          <Fragment>
            <LabeledInputField
              id="email"
              required={true}
              labelName="Email"
              inputFieldValue={form.email}
              placeholder="you@example.com"
              icon={<Mail className="authIconClasses" />}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <LabeledInputField
              id="password"
              required={true}
              fieldType="password"
              labelName="Password"
              placeholder="••••••••"
              inputFieldValue={form.password}
              icon={<Lock className="authIconClasses" />}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Fragment>
          <div className="mt-6 mb-5">
            <AuthAction
              to="/forgot-password"
              linkTitle="Reset password"
              actionTitle="Forgot Password?"
            />
            <AuthAction
              to="/resend-verification-email"
              linkTitle="Resend verification email"
              actionTitle="Didn't verify your account?"
            />
          </div>
          <CustomButton
            title="Login"
            type="submit"
            isLoading={isLoading}
            buttonClasses="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 transition-colors text-white shadow-lg cursor-pointer"
          />
          <AuthAction
            to="/signup"
            linkTitle="Sign up"
            actionTitle="Don't have an account?"
            containerClasses="w-full justify-center mt-5 !mb-0"
          />
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default Login;
