import React, { useState } from "react";
import { UseMutateFunction, useQuery } from "@tanstack/react-query";
import { getUserConversations } from "@/services/conversationServices";
import Loader from "../shared/Loader";
import { UserState } from "@/store/userSlice";
import ConversationsList from "./ConversationsList";
import SidebarHeaderContent from "./SidebarHeaderContent";
import StartChatDialogButton from "./StartChatDialogButton";
import { APIError, ConversationType } from "@/@types/general";
import ResourcesLoaderContainer from "../shared/ResourcesLoaderContainer";
import FailedResourcesLoadingLoader from "../shared/FailedResourcesLoadingLoader";

const ChatConversationsListSection = ({
  user,
  conversation,
  handleJoinRoom,
  joinOrCreateRoom,
  selectedConversationId,
  onSetSelectedConversationId,
}: {
  user: UserState;
  selectedConversationId: string;
  conversation: ConversationType | null;
  onSetSelectedConversationId: React.Dispatch<React.SetStateAction<string>>;
  handleJoinRoom: (conversation: ConversationType) => void;
  joinOrCreateRoom: UseMutateFunction<
    ConversationType,
    APIError,
    string,
    unknown
  >;
}) => {
  const [contact, setContact] = useState("");
  const [open, setOpen] = useState(false);

  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleConversationClick = (conversation: ConversationType) => {
    handleJoinRoom(conversation);
  };

  const startChatHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContact("");
    joinOrCreateRoom(contact);
    setOpen(false);
  };

  return (
    <div className="w-[25vw] flex-shrink-0 relative z-10">
      <div className="w-full h-full backdrop-blur-xl bg-white/40 dark:bg-black/40 border-r border-white/20 dark:border-emerald-500/20 pt-2 pb-5">
        <div className="flex justify-between item-center py-4 mb-4 border-b border-white/20 dark:border-emerald-500/20 ps-5 pe-2">
          <SidebarHeaderContent
            photo={user.user?.photo}
            roomId={conversation?.roomId}
            userInitials={user.user?.name?.slice(0, 2).toUpperCase()}
          />
        </div>
        <div className="flex flex-col h-[92%] justify-between">
          {isError ? (
            <ResourcesLoaderContainer>
              <FailedResourcesLoadingLoader errorMessage="Failed to load conversations" />
            </ResourcesLoaderContainer>
          ) : isLoading ? (
            <ResourcesLoaderContainer>
              <Loader loaderText="Loading conversations..." />
            </ResourcesLoaderContainer>
          ) : (
            <ConversationsList
              user={user}
              conversations={conversations}
              onConversationClick={handleConversationClick}
              selectedConversationId={selectedConversationId}
              onSetSelectedConversationId={onSetSelectedConversationId}
            />
          )}
          <StartChatDialogButton
            open={open}
            contact={contact}
            onSetOpen={setOpen}
            onSetContact={setContact}
            onStartChatHandler={startChatHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatConversationsListSection;
