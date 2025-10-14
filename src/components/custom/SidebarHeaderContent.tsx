import { Fragment } from "react";
import UserDataHeader from "../shared/UserDataHeader";

const SidebarHeaderContent = ({
  photo,
  userName,
  userInitials,
}: {
  photo: string | undefined;
  userName: string | undefined;
  userInitials: string | undefined;
}) => {
  return (
    <Fragment>
      <h3 className="text-3xl text-white mb-1">Chats</h3>
      <UserDataHeader
        photo={photo}
        alt="User photo"
        userName={userName}
        userInitials={userInitials}
      />
    </Fragment>
  );
};

export default SidebarHeaderContent;
