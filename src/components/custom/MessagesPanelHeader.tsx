import UserDataHeader from "../shared/UserDataHeader";

const MessagesPanelHeader = ({
  photo,
  recipientName,
  recipientInitials,
}: {
  photo: string | undefined;
  recipientName: string | undefined;
  recipientInitials: string | undefined;
}) => {
  return (
    <div className="w-full h-[70px] bg-green-600 flex items-center px-5">
      <UserDataHeader
        photo={photo}
        alt="User photo"
        userName={recipientName}
        userInitials={recipientInitials}
      />
    </div>
  );
};

export default MessagesPanelHeader;
