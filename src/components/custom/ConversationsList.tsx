import React from "react";
import { UserState } from "@/store/userSlice";
import ConversationItem from "./ConversationItem";
import { ConversationType, Member } from "@/@types/general";

type ConversationsListType = {
  user: UserState;
  selectedConversationId: string;
  conversations: ConversationType[];
  onConversationClick: (conversationType: ConversationType) => void;
  onSetSelectedConversationId: React.Dispatch<React.SetStateAction<string>>;
};

const ConversationsList = ({
  user,
  conversations,
  onConversationClick,
  selectedConversationId,
  onSetSelectedConversationId,
}: ConversationsListType) => {
  return (
    <ul className="flex flex-col divide-y divide-white/10 dark:divide-emerald-500/10 ">
      {conversations.length === 0 ? (
        <p className="text-center mt-8 text-gray-900">Start new conversation</p>
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
              conversationId={conversation._id}
              lastMessage={conversation.lastMessage ?? {}}
              selectedConversationId={selectedConversationId}
              onClick={() => {
                onSetSelectedConversationId(conversation._id);
                onConversationClick(conversation);
              }}
              userInitials={recipientUser?.name.slice(0, 2).toUpperCase()}
            />
          );
        })
      )}
    </ul>
  );
};

export default ConversationsList;
