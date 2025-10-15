import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios";
import AuthForm from "@/components/shared/AuthForm";
import FormHeader from "@/components/shared/FormHeader";
import AuthAction from "@/components/shared/AuthAction";
import CustomButton from "@/components/shared/CustomButton";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import LabeledInputField from "@/components/shared/LabeledInputField";
import FormButtonsContainer from "@/components/shared/FormButtonsContainer";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "../../constants/general";

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
      <AuthFormContainer>
        <FormHeader title="Forgot password" />
        <AuthForm onSubmit={submitHandler}>
          <LabeledInputField
            id="email"
            required={true}
            labelName="Email"
            inputFieldValue={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthAction
            to="/login"
            linkTitle="Login"
            actionTitle="Remembered your password?"
          />
          <FormButtonsContainer containerClasses="!mt-4">
            <CustomButton title="Submit" isLoading={isLoading} type="submit" />
          </FormButtonsContainer>
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default ForgotPassword;
