import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { RootState } from "../../store";
import axiosInstance from "../../lib/axios";
import BACKEND_RESOURCES from "../../constants/backendResources";
import RESPONSE_STATUSES from "../../constants/responseStatuses";
import SuspenseWrapper from "@/components/custom/SuspenseWrapper";

const Signup = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [user.isLoggedIn, navigate]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/signup`,
        form
      );

      if (res.status === RESPONSE_STATUSES.CREATED) {
        navigate("/");
        toast(res.data?.message);
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
        <h1 className="text-2xl text-center mb-8 w-full text-indigo-700 font-bold">
          Signup
        </h1>
        <form onSubmit={submitHandler} className="flex-col h-full">
          <div className="flex flex-col items-between w-full mb-5">
            <label
              htmlFor="name"
              className="mb-1 ms-[2px] text-lg font-bold text-indigo-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              placeholder="Enter your name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
            />
          </div>
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
              value={form.email}
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
            />
          </div>
          <div className="flex flex-col items-between w-full h-[10vh]">
            <label
              htmlFor="password"
              className="mb-1 ms-[2px] text-lg font-bold text-indigo-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
            />
          </div>
          <div className="flex flex-col items-between w-full h-[10vh]">
            <label
              htmlFor="confirmPassword"
              className="mb-1 ms-[2px] text-lg font-bold text-indigo-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              placeholder="Re-enter your password"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent"
            />
          </div>
          <div className="w-full flex justify-end items-end gap-x-5 mt-10">
            <Link
              className="w-[5vw] py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer"
              to="/login"
            >
              Login
            </Link>
            <button
              className="w-[6vw] px-1 py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer"
              type="submit"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </SuspenseWrapper>
  );
};

export default Signup;
