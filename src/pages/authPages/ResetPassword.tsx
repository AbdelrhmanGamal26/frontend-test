import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios";
import AuthForm from "@/components/shared/AuthForm";
import FormHeader from "@/components/shared/FormHeader";
import AuthAction from "@/components/shared/AuthAction";
import CustomButton from "@/components/shared/CustomButton";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import FormButtonsContainer from "@/components/shared/FormButtonsContainer";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";

type UserInput = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [form, setForm] = useState<UserInput>({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [params] = useSearchParams();
  const resetToken = params.get("resetToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetToken) {
      setIsTokenValid(false);
      toast("Invalid or missing token");
      return;
    }

    const validateToken = async () => {
      try {
        await axiosInstance.get(
          `${BACKEND_RESOURCES.AUTH}/verify-reset-token?resetToken=${resetToken}`
        );
        setIsTokenValid(true);
      } catch {
        setIsTokenValid(false);
        toast("Invalid or missing token");
      }
    };

    validateToken();
  }, [resetToken]);

  if (isTokenValid === false) {
    navigate("/login", { replace: true });
  }

  if (isTokenValid === null) {
    return <p>Validating reset link...</p>; // loading state
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.patch(
        `${BACKEND_RESOURCES.AUTH}/reset-password?resetToken=${resetToken}`,
        form
      );

      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        navigate("/login", { replace: true });
        setIsLoading(false);
        toast("Password reset successfully");
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message);
        console.log(error.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <SuspenseWrapper>
      <AuthFormContainer>
        <FormHeader title="Reset password" />
        <AuthForm onSubmit={submitHandler}>
          <Fragment>
            <LabeledInputField
              id="password"
              required={true}
              labelName="Password"
              fieldType="password"
              inputFieldValue={form.password}
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <LabeledInputField
              required={true}
              id="confirmPassword"
              fieldType="password"
              labelName="Confirm Password"
              inputFieldValue={form.confirmPassword}
              placeholder="Re-enter your password"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </Fragment>
          <Fragment>
            <AuthAction
              to="/login"
              linkTitle="Login"
              actionTitle="Remembered your password?"
            />
          </Fragment>
          <FormButtonsContainer containerClasses="!mt-4">
            <CustomButton title="Submit" isLoading={isLoading} type="submit" />
          </FormButtonsContainer>
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default ResetPassword;
