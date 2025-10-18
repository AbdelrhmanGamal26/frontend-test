import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { EllipsisVertical } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { logout } from "@/store/userSlice";
import socket from "@/websocket/socketHandler";
import CustomButton from "../shared/CustomButton";
import UserDataWithoutName from "../shared/UserDataWithoutName";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "@/constants/general";

const SidebarHeaderContent = ({
  photo,
  roomId,
  userInitials,
}: {
  photo: string | undefined;
  roomId: string | undefined;
  userInitials: string | undefined;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full flex justify-between items-center">
      <h2 className="font-normal text-gray-900 dark:text-emerald-50">
        Messages
      </h2>
      <div className="flex items-center">
        <UserDataWithoutName
          photo={photo}
          alt="User photo"
          userInitials={userInitials}
        />
        <div
          className="relative cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <button
            className="p-2 hover:bg-white/50 dark:hover:bg-black/50 rounded-lg
                       transition-colors duration-300 ms-2 cursor-pointer"
          >
            <EllipsisVertical
              size={20}
              className="text-gray-600 dark:text-emerald-300 transition-all duration-200"
            />
          </button>
          <UserDropdownMenu roomId={roomId} showMenu={showMenu} />
        </div>
      </div>
    </div>
  );
};

export default SidebarHeaderContent;

const UserDropdownMenu = ({
  roomId,
  showMenu,
}: {
  roomId: string | undefined;
  showMenu: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        `${BACKEND_RESOURCES.USERS}/logout`
      );
      if (response.status === RESPONSE_STATUSES.SUCCESS) {
        navigate("/login", { replace: true });
        dispatch(logout());
        setIsLoading(false);
        toast(response.data?.message);
        socket.emit("leaveRoom", { roomId });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast("Something went wrong!");
    }
  };

  return (
    <AnimatePresence>
      {showMenu && (
        <motion.div
          key="dropdown"
          initial={{ opacity: 0, scale: 0.9, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -6 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute top-8 left-5 w-[150px] px-3 py-2 bg-green-200 dark:bg-emerald-800/90 
                     rounded-xl shadow-xl z-50 backdrop-blur-md border border-emerald-400/20"
        >
          <ul className="w-full flex flex-col gap-y-2">
            <li>
              <CustomButton
                title="Logout"
                isLoading={isLoading}
                onClick={logoutHandler}
                buttonClasses="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 
                               hover:from-emerald-600 hover:to-yellow-500 
                               transition-colors text-white shadow-lg cursor-pointer"
              />
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
