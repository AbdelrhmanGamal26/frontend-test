import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios";
import AuthForm from "@/components/shared/AuthForm";
import AuthAction from "@/components/shared/AuthAction";
import CustomButton from "@/components/shared/CustomButton";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import LabeledInputField from "@/components/shared/LabeledInputField";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "../../constants/general";
import GlassmorphismBackground from "@/components/shared/GlassmorphismBackground";
import ForgotPasswordFormHeader from "@/components/custom/ForgotPasswordFormHeader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/forgot-password`,
        { email }
      );

      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        navigate("/login");
        setIsLoading(false);
        toast("Please check your email inbox for the activation email");
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
      <GlassmorphismBackground />
      <AuthFormContainer authFormHeader={<ForgotPasswordFormHeader />}>
        <AuthForm onSubmit={submitHandler}>
          <LabeledInputField
            id="email"
            required={true}
            labelName="Email"
            inputFieldValue={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="authIconClasses" />}
          />
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
            containerClasses="!mb-0"
            actionTitle="Remembered your password?"
          />
        </div>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default ForgotPassword;
