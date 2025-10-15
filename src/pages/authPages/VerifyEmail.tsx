import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const verificationToken = params.get("verificationToken");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserAccount = async () => {
      try {
        const response = await axiosInstance.get(
          `${BACKEND_RESOURCES.AUTH}/verify-email?verificationToken=${verificationToken}`
        );

        toast(response.data?.message);

        switch (response.status) {
          case RESPONSE_STATUSES.BAD_REQUEST:
          case RESPONSE_STATUSES.SERVER:
            setIsLoading(false);
            navigate("/login");
            break;
          case RESPONSE_STATUSES.SUCCESS:
          case RESPONSE_STATUSES.FOUND:
            setIsLoading(false);
            navigate("/", { replace: true });
            break;
          default:
            navigate("/login");
        }
      } catch (error) {
        setIsLoading(false);
        if (error instanceof AxiosError) {
          navigate("/login");
          toast(error.response?.data?.message);
        } else if (error instanceof Error) {
          toast(error?.message);
        } else {
          console.log(error);
        }
      }
    };

    if (verificationToken) {
      verifyUserAccount();
    } else {
      toast("Verification token missing.");
      navigate("/login");
    }
  }, [verificationToken, navigate]);

  return <div className="text-white">{isLoading ? "Please wait..." : ""}</div>;
};

export default VerifyEmail;
