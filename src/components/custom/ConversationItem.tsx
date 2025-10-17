import UserPhoto from "../shared/UserPhoto";
import { formatMessageTime } from "@/lib/utils";
import { LastMessage, Member } from "@/@types/general";

const ConversationItem = ({
  alt,
  photo,
  onClick,
  lastMessage,
  userInitials,
  recipientUser,
}: {
  alt: string;
  onClick: () => void;
  lastMessage: LastMessage;
  photo: string | undefined;
  userInitials: string | undefined;
  recipientUser: Member | undefined;
}) => {
  const messageTime = formatMessageTime(lastMessage.createdAt) ?? "";

  return (
    <li
      className="flex items-center gap-x-2 w-full h-[70px] bg-green-300 hover:bg-green-500 p-2 rounded-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {photo ? (
        <UserPhoto src={photo} alt={alt} />
      ) : (
        <div className="w-[45px] h-[45px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {userInitials}
        </div>
      )}
      <div className="flex flex-col flex-1">
        <p>{recipientUser?.name ?? "Deleted user"}</p>
        <div className="w-full flex justify-between items-center">
          <p className="max-w-[150px] truncate">{lastMessage.content}</p>
          {messageTime && (
            <p className="text-[12px] mt-[4px]">Sent: {messageTime}</p>
          )}
        </div>
      </div>
    </li>
  );
};

export default ConversationItem;
