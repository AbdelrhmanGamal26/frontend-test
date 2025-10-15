import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { EllipsisVertical } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { logout } from "@/store/userSlice";
import CustomLink from "../shared/CustomLink";
import socket from "@/websocket/socketHandler";
import CustomButton from "../shared/CustomButton";
import UserDataHeader from "../shared/UserDataHeader";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "@/constants/general";

const SidebarHeaderContent = ({
  photo,
  roomId,
  userName,
  userInitials,
}: {
  photo: string | undefined;
  roomId: string | undefined;
  userName: string | undefined;
  userInitials: string | undefined;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full flex justify-between items-center">
      <h3 className="text-3xl text-white mb-2">Chats</h3>
      <div className="flex items-center">
        <div
          className="relative cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <EllipsisVertical
            size={24}
            className="text-white hover:text-yellow-300 me-2 transition-all duration-200"
          />
          {showMenu && <UserDropdownMenu roomId={roomId} />}
        </div>
        <UserDataHeader
          photo={photo}
          alt="User photo"
          userName={userName}
          userInitials={userInitials}
        />
      </div>
    </div>
  );
};

export default SidebarHeaderContent;

const UserDropdownMenu = ({ roomId }: { roomId: string | undefined }) => {
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
    <div className="absolute top-8 right-4 w-[150px] px-3 py-2 bg-green-400 rounded-md">
      <ul className="w-full flex flex-col gap-y-2">
        <li className="w-full">
          <CustomLink to="/profile" title="Profile" linkClasses="w-full" />
        </li>
        <li>
          <CustomButton
            title="Logout"
            isLoading={isLoading}
            buttonClasses="w-full"
            onClick={logoutHandler}
          />
        </li>
      </ul>
    </div>
  );
};
