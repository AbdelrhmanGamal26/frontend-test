import { UserState } from "@/store/userSlice";
import ConversationItem from "./ConversationItem";
import { ConversationType, Member } from "@/@types/general";

type ConversationsListType = {
  user: UserState;
  conversations: ConversationType[];
  onConversationClick: (conversationType: ConversationType) => void;
};

const ConversationsList = ({
  user,
  conversations,
  onConversationClick,
}: ConversationsListType) => {
  return (
    <ul className="flex flex-col gap-y-4">
      {conversations.length === 0 ? (
        <p className="text-white text-center mt-8">Start a new conversation</p>
      ) : (
        conversations.map((conversation: ConversationType) => {
          const recipientUser = conversation.members.find(
            (member: Member) => member._id !== user.user?.userId
          );

          return (
            <ConversationItem
              alt="User photo"
              key={conversation._id}
              photo={recipientUser?.photo}
              recipientUser={recipientUser}
              lastMessage={conversation.lastMessage ?? {}}
              onClick={() => onConversationClick(conversation)}
              userInitials={recipientUser?.name.slice(0, 2).toUpperCase()}
            />
          );
        })
      )}
    </ul>
  );
};

export default ConversationsList;
