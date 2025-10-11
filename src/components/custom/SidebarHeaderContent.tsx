import { Fragment } from "react";

const SidebarHeaderContent = ({
  userName,
  userInitials,
}: {
  userName: string | undefined;
  userInitials: string | undefined;
}) => {
  return (
    <Fragment>
      <h3 className="text-3xl text-white mb-1">Chats</h3>
      <div className="flex items-center gap-x-2">
        <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {userInitials}
        </div>
        <p className="text-white text-xl">{userName}</p>
      </div>
    </Fragment>
  );
};

export default SidebarHeaderContent;
