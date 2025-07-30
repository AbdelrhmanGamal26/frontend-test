import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { RootState } from "../../store";
import { login } from "../../store/userSlice";
import axiosInstance, { setAccessToken } from "../../lib/axios";
import SuspenseWrapper from "@/components/custom/SuspenseWrapper";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../../constants/general";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [user.isLoggedIn, navigate, from]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${BACKEND_RESOURCES.AUTH}/login`,
        form
      );

      const { _id, name, email } = res.data.data.user;
      const accessToken = res.data.data.accessToken;

      setAccessToken(accessToken);
      dispatch(login({ userId: _id, name, email, accessToken }));

      // Always check the status after dispatching
      if (res.status === RESPONSE_STATUSES.SUCCESS) {
        navigate(from, { replace: true }); // user goes back to the protected route
        toast("login successful!");
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
          login
        </h2>
        <form onSubmit={submitHandler} className="flex-col h-full">
          <div>
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
          </div>
          <div>
            <div className="flex gap-x-1">
              <p>Forgot Password?</p>
              <Link
                to="/forgot-password"
                className="text-indigo-700 hover:text-orange-200"
              >
                Click here
              </Link>
            </div>
            <div className="flex gap-x-1">
              <p>Didn't verify your account?</p>
              <Link
                to="/resend-verification-email"
                className="text-indigo-700 hover:text-orange-200"
              >
                Resend Verification email
              </Link>
            </div>
          </div>
          <div className="w-full flex justify-end items-end gap-x-5 mt-10">
            <Link
              className="w-[5vw] py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer"
              to="/signup"
            >
              Signup
            </Link>
            <button
              className="w-[5vw] py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </SuspenseWrapper>
  );
};

export default Login;
