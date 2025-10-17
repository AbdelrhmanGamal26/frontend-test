import { Fragment, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios";
import AuthForm from "@/components/shared/AuthForm";
import AuthAction from "@/components/shared/AuthAction";
import CustomButton from "@/components/shared/CustomButton";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";
import ResetPasswordFormHeader from "@/components/custom/ResetPasswordFormHeader";

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
      <AuthFormContainer authFormHeader={<ResetPasswordFormHeader />}>
        <AuthForm onSubmit={submitHandler}>
          <Fragment>
            <LabeledInputField
              id="password"
              required={true}
              labelName="Password"
              fieldType="password"
              placeholder="••••••••"
              inputFieldValue={form.password}
              icon={<Lock className="authIconClasses" />}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <LabeledInputField
              required={true}
              fieldType="password"
              id="confirmPassword"
              placeholder="••••••••"
              labelName="Confirm Password"
              inputFieldValue={form.confirmPassword}
              icon={<Lock className="authIconClasses" />}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </Fragment>
          <CustomButton
            type="submit"
            title="Submit"
            isLoading={isLoading}
            buttonClasses="w-full mt-2 bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 transition-colors text-white shadow-lg cursor-pointer"
          />
        </AuthForm>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <AuthAction
            to="/login"
            linkTitle="Login"
            actionTitle="Remembered your password?"
          />
        </div>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default ResetPassword;
