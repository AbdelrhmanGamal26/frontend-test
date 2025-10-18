import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Lock, Mail, User } from "lucide-react";
import { RootState } from "../../store";
import axiosInstance from "../../lib/axios";
import AuthForm from "@/components/shared/AuthForm";
import AuthAction from "@/components/shared/AuthAction";
import UploadPhoto from "@/components/shared/UploadPhoto";
import AppFeatures from "@/components/custom/AppFeatures";
import CustomButton from "@/components/shared/CustomButton";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import SignupFormHeader from "@/components/custom/SignupFormHeader";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "../../constants/general";
import GlassmorphismBackground from "@/components/shared/GlassmorphismBackground";
import PasswordStrengthIndicator from "@/components/custom/PasswordStrengthIndicator";

interface FormType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo: string | null;
}

const Signup = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const imagePreview = image && URL.createObjectURL(image);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
  });

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [user.isLoggedIn, navigate]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("confirmPassword", form.confirmPassword);
    if (image) formData.append("photo", image);

    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === RESPONSE_STATUSES.CREATED) {
        navigate("/login");
        setIsLoading(false);
        toast(res.data?.message);
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
      <AppFeatures />
      <AuthFormContainer authFormHeader={<SignupFormHeader />}>
        <AuthForm onSubmit={submitHandler}>
          <LabeledInputField
            id="name"
            required={true}
            labelName="Name"
            placeholder="John Doe"
            inputFieldValue={form.name}
            icon={<User className="authIconClasses" />}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <LabeledInputField
            id="email"
            required={true}
            labelName="Email"
            inputFieldValue={form.email}
            placeholder="you@example.com"
            icon={<Mail className="authIconClasses" />}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Fragment>
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
            {form.password && (
              <PasswordStrengthIndicator
                passwordLength={form.password.length}
              />
            )}
          </Fragment>
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
          <UploadPhoto
            image={image}
            onSetImage={setImage}
            imagePreview={imagePreview}
          />
          <CustomButton
            type="submit"
            title="Sign up"
            isLoading={isLoading}
            buttonClasses="w-full mt-8 bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 transition-colors text-white shadow-lg cursor-pointer"
          />
          <AuthAction
            to="/login"
            linkTitle="Login"
            actionTitle="Already have an account?"
            containerClasses="w-full justify-center mt-5 !mb-0"
          />
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default Signup;
