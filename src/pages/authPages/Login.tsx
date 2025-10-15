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
import AuthAction from "@/components/shared/AuthAction";
import CustomButton from "@/components/shared/CustomButton";
import axiosInstance, { setAccessToken } from "../../lib/axios";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import FormButtonsContainer from "@/components/shared/FormButtonsContainer";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";

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
      <AuthFormContainer>
        <FormHeader title="Login" />
        <AuthForm onSubmit={submitHandler}>
          <Fragment>
            <LabeledInputField
              id="email"
              required={true}
              labelName="Email"
              inputFieldValue={form.email}
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <LabeledInputField
              id="password"
              required={true}
              labelName="Password"
              fieldType="password"
              inputFieldValue={form.password}
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Fragment>
          <Fragment>
            <AuthAction
              to="/forgot-password"
              linkTitle="Click here"
              actionTitle="Forgot Password?"
            />
            <AuthAction
              to="/resend-verification-email"
              linkTitle="Resend verification email"
              actionTitle="Didn't verify your account?"
            />
          </Fragment>
          <FormButtonsContainer containerClasses="!mt-4">
            <CustomLink to="/signup" title="Signup" />
            <CustomButton title="Login" isLoading={isLoading} type="submit" />
          </FormButtonsContainer>
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default Login;
