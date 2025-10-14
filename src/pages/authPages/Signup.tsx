import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../../store";
import axiosInstance from "../../lib/axios";
import AuthForm from "@/components/shared/AuthForm";
import CustomLink from "@/components/shared/CustomLink";
import FormHeader from "@/components/shared/FormHeader";
import UploadPhoto from "@/components/shared/UploadPhoto";
import CustomButton from "@/components/shared/CustomButton";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import LabeledInputField from "@/components/shared/LabeledInputField";
import AuthFormContainer from "@/components/shared/AuthFormContainer";
import FormButtonsContainer from "@/components/shared/FormButtonsContainer";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "../../constants/general";

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
        setIsLoading(false);
        navigate("/");
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
      <AuthFormContainer>
        <FormHeader title="Signup" />
        <AuthForm onSubmit={submitHandler}>
          <LabeledInputField
            id="name"
            required={true}
            labelName="Name"
            inputFieldValue={form.name}
            placeholder="Enter your name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <LabeledInputField
            required={true}
            id="confirmPassword"
            fieldType="password"
            labelName="Confirm Password"
            placeholder="Re-enter your password"
            inputFieldValue={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <UploadPhoto
            image={image}
            onSetImage={setImage}
            imagePreview={imagePreview}
          />
          <FormButtonsContainer>
            <CustomLink to="/login" title="Login" />
            <CustomButton title="Sign up" isLoading={isLoading} type="submit" />
          </FormButtonsContainer>
        </AuthForm>
      </AuthFormContainer>
    </SuspenseWrapper>
  );
};

export default Signup;
