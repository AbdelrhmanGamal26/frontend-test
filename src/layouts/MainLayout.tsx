import { toast } from "react-toastify";
import { Link, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import axiosInstance from "../lib/axios";
import { logout } from "../store/userSlice";
import { RESPONSE_STATUSES, BACKEND_RESOURCES } from "../constants/general";

const MainLayout = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const response = await axiosInstance.post(
        `${BACKEND_RESOURCES.USERS}/logout`
      );
      if (response.status === RESPONSE_STATUSES.SUCCESS) {
        dispatch(logout());
        toast(response.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast("Something went wrong!");
    }
  };

  return (
    <>
      <header className="w-full h-[75px] flex justify-center bg-blue-400">
        <div className="container h-full px-16 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl text-white">
            Your App
          </Link>
          <div className="flex gap-x-5">
            <Link
              to="/dashboard"
              className="w-[100px] h-[30px] flex justify-center items-center text-blue-300 bg-amber-100 rounded-md border-amber-200 hover:bg-green-50 cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="w-[50px] h-[30px] flex justify-center items-center text-blue-300 bg-amber-100 rounded-md border-amber-200 hover:bg-green-50 cursor-pointer"
            >
              Profile
            </Link>
            <Link
              to="/chat"
              className="w-[50px] h-[30px] flex justify-center items-center text-blue-300 bg-amber-100 rounded-md border-amber-200 hover:bg-green-50 cursor-pointer"
            >
              chat
            </Link>
          </div>
          {user.isLoggedIn ? (
            <div className="flex items-center gap-x-3">
              <p className="text-black">hello {user.user?.name}</p>
              <button
                className="w-[50px] h-[30px] flex justify-center items-center text-blue-300 bg-amber-100 rounded-md border-amber-200 hover:bg-green-50 cursor-pointer"
                onClick={logoutHandler}
              >
                logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="w-[50px] h-[30px] flex justify-center items-center text-blue-300 bg-amber-100 rounded-md border-amber-200 hover:bg-green-50 cursor-pointer"
            >
              login
            </Link>
          )}
        </div>
      </header>
      <Outlet />
      <footer className="w-full h-[200px] bg-blue-400">footer</footer>
    </>
  );
};

export default MainLayout;
