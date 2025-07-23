import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import axiosInstance from "../../lib/axios";
import BACKEND_RESOURCES from "../../constants/backendResources";
import RESPONSE_STATUSES from "../../constants/responseStatuses";
import SuspenseWrapper from "@/components/custom/SuspenseWrapper";

type UserInput = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    password: "",
    confirmPassword: "",
  });
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
    return <Navigate to="/forgot-password" replace />;
  }

  if (isTokenValid === null) {
    return <p>Validating reset link...</p>; // loading state
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.patch(
        `${BACKEND_RESOURCES.AUTH}/reset-password?resetToken=${resetToken}`,
        userInput
      );

      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        navigate("/login");
        toast("Password reset successfully");
      }
    } catch (error) {
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
      <div className="flex-col w-[28vw] min-h-[25vh] bg-gradient-to-b from-green-400 to-red-400 px-7 py-5 rounded-4xl">
        <h2 className="text-2xl text-center mb-8 w-full text-indigo-700 font-bold">
          Reset password
        </h2>
        <form onSubmit={submitHandler} className="flex-col h-full">
          <div>
            <div className="flex flex-col items-between w-full mb-5">
              <label
                htmlFor="password"
                className="mb-1 ms-[2px] text-lg font-bold text-indigo-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={userInput.password}
                placeholder="Enter your password"
                onChange={(e) =>
                  setUserInput({ ...userInput, password: e.target.value })
                }
                className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
              />
            </div>
            <div className="flex flex-col items-between w-full mb-5">
              <label
                htmlFor="confirmPassword"
                className="mb-1 ms-[2px] text-lg font-bold text-indigo-700"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={userInput.confirmPassword}
                placeholder="Re-enter your password"
                onChange={(e) =>
                  setUserInput({
                    ...userInput,
                    confirmPassword: e.target.value,
                  })
                }
                className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
              />
            </div>
          </div>
          <div className="flex gap-x-1">
            <p>Remembered your password?</p>
            <Link to="/login" className="text-indigo-700 hover:text-orange-200">
              Login
            </Link>
          </div>
          <div className="w-full flex justify-end items-end gap-x-5 mt-20">
            <button
              className="w-[5vw] py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer"
              type="submit"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </SuspenseWrapper>
  );
};

export default ResetPassword;
