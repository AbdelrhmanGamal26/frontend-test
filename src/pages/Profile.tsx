import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import { logout } from "../store/userSlice";
import CustomDialog from "@/components/custom/CustomDialog";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "../constants/general";
import DeleteItemOverlayContent from "@/components/custom/DeleteItemOverlayContent";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const clickHandler = async () => {
    try {
      const response = await axiosInstance.delete(
        `${BACKEND_RESOURCES.USERS}/me`
      );

      const data = response.data || {};

      if (response.status === RESPONSE_STATUSES.SUCCESS) {
        delete axiosInstance.defaults.headers.common["Authorization"];
        dispatch(logout());
        navigate("/login", { replace: true });
        toast(data?.message);
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
    setOpen(false);
  };

  return (
    <SuspenseWrapper>
      <div>
        <h1 className="text-3xl">Profile</h1>
        <CustomDialog
          open={open}
          setOpen={setOpen}
          triggerClasses="!bg-transparent"
          contentClassName="!max-w-[90vw] sm:!max-w-[50vw] lg:!max-w-[35vw] top-[50%] translate-y-[-50%]"
          trigger={
            <div className="bg-red-400 hover:bg-red-700 rounded-md outline-0 px-2 py-1 text-white cursor-pointer transition-all duration-150">
              Delete profile
            </div>
          }
        >
          <DeleteItemOverlayContent
            setOpen={setOpen}
            clickHandler={clickHandler}
          />
        </CustomDialog>
      </div>
    </SuspenseWrapper>
  );
};

export default Profile;
