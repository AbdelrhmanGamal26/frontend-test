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
  conversationId,
  selectedConversationId,
}: {
  alt: string;
  onClick: () => void;
  conversationId: string;
  lastMessage: LastMessage;
  photo: string | undefined;
  selectedConversationId: string;
  userInitials: string | undefined;
  recipientUser: Member | undefined;
}) => {
  const messageTime = formatMessageTime(lastMessage.createdAt) ?? "";

  return (
    <li
      onClick={onClick}
      className={`w-full p-4 cursor-pointer flex items-center gap-3 hover:bg-white/30 dark:hover:bg-black/30 transition-colors backdrop-blur-sm ${
        selectedConversationId === conversationId
          ? "bg-gradient-to-r from-emerald-500/20 to-yellow-400/20 dark:from-emerald-600/30 dark:to-yellow-500/30 border-l-4 border-b-1 border-emerald-500 dark:border-emerald-400"
          : ""
      }`}
    >
      {photo ? (
        <UserPhoto src={photo} alt={alt} />
      ) : (
        <div
          className={`w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center`}
        >
          {userInitials}
        </div>
      )}
      <div className="flex flex-col flex-1">
        <p className="text-gray-900 dark:text-emerald-50 truncate">
          {recipientUser?.name ?? "Deleted user"}
        </p>
        <div className="w-full flex justify-between items-center">
          <p className="max-w-[150px] text-gray-500 dark:text-emerald-300/70 truncate">
            {lastMessage.content}
          </p>
          {messageTime && (
            <p className="text-gray-500 dark:text-emerald-300/80 flex-shrink-0 ml-2 text-[12px] mt-1.5">
              Sent: {messageTime}
            </p>
          )}
        </div>
      </div>
    </li>
  );
};

export default ConversationItem;
