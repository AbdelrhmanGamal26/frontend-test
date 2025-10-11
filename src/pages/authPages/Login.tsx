import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { RootState } from "../../store";
import { login } from "../../store/userSlice";
import AuthForm from "@/components/shared/AuthForm";
import FormHeader from "@/components/shared/FormHeader";
import CustomLink from "@/components/shared/CustomLink";
import CustomButton from "@/components/shared/CustomButton";
import axiosInstance, { setAccessToken } from "../../lib/axios";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";
import AuthActionLinkContainer from "@/components/shared/AuthActionLinkContainer";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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
    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/login`,
        form
      );

      const { _id, name, email } = res.data.data.user;
      const accessToken = res.data.data.accessToken;

      setAccessToken(accessToken);
      dispatch(login({ userId: _id, name, email, accessToken }));

      // Always check the status after dispatching
      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        navigate(from, { replace: true }); // user goes back to the protected route
        toast("login successful!");
      }
    } catch (error) {
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
      <AuthFormContainer>
        <FormHeader title="Login" />
        <AuthForm onSubmit={submitHandler}>
          <Fragment>
            <LabeledInputField
              id="email"
              labelName="Email"
              inputFieldValue={form.email}
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <LabeledInputField
              id="password"
              labelName="Password"
              fieldType="password"
              inputFieldValue={form.password}
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Fragment>
          <Fragment>
            <AuthActionLinkContainer>
              <p>Forgot Password?</p>
              <CustomLink
                to="/forgot-password"
                title="Click here"
                linkClasses="text-indigo-700 hover:!text-orange-200 !bg-transparent !w-fit"
              />
            </AuthActionLinkContainer>
            <AuthActionLinkContainer>
              <p>Didn't verify your account?</p>
              <CustomLink
                to="/resend-verification-email"
                title="Resend Verification email"
                linkClasses="text-indigo-700 hover:!text-orange-200 !bg-transparent !w-fit"
              />
            </AuthActionLinkContainer>
          </Fragment>
          <div className="w-full flex justify-end items-end gap-x-5 mt-4">
            <CustomLink to="/signup" title="Signup" />
            <CustomButton title="Login" type="submit" />
          </div>
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default Login;
