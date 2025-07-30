import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import axiosInstance from "../../lib/axios";
import SuspenseWrapper from "@/components/custom/SuspenseWrapper";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "../../constants/general";

const ResendVerificationEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/resend-verification-token`,
        { email }
      );

      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        toast(res.data?.message);
        navigate("/login");
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
      <div className="flex-col w-[28vw] min-h-[25vh] bg-gradient-to-b from-green-400 to-red-400 px-7 py-5 rounded-4xl">
        <h2 className="text-2xl text-center mb-8 w-full text-indigo-700 font-bold">
          Resend verification email
        </h2>
        <form onSubmit={submitHandler} className="flex-col h-full">
          <div className="flex flex-col items-between w-full mb-5">
            <label
              htmlFor="email"
              className="mb-1 ms-[2px] text-lg font-bold text-indigo-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
            />
          </div>
          <div className="flex gap-x-1">
            <p>Already verified your account?</p>
            <Link to="/login" className="text-indigo-700 hover:text-orange-200">
              Login
            </Link>
          </div>
          <div className="w-full flex justify-end items-end gap-x-5 mt-10">
            <button
              className="w-[5vw] py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </SuspenseWrapper>
  );
};

export default ResendVerificationEmail;
