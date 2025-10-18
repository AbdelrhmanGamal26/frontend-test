import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  sendMessage,
  fetchConversationMessages,
} from "@/services/conversationServices";
import Loader from "../shared/Loader";
import socket from "@/websocket/socketHandler";
import MessagesContainer from "./MessagesContainer";
import MessageSendingForm from "./MessageSendingForm";
import MessagesPanelHeader from "./MessagesPanelHeader";
import { ConversationType, Member, MessageType } from "@/@types/general";
import ResourcesLoaderContainer from "../shared/ResourcesLoaderContainer";
import FailedResourcesLoadingLoader from "../shared/FailedResourcesLoadingLoader";
import MessagesPanelStartView from "./MessagesPanelStartView";

interface ChatMessagesPanelSectionType {
  userId: string;
  showMessages: boolean;
  conversationId: string;
  recipient: Member | undefined;
  conversation: ConversationType | null;
}

const ChatMessagesPanelSection = ({
  userId,
  recipient,
  conversation,
  showMessages,
  conversationId,
}: ChatMessagesPanelSectionType) => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  /** =============== Fetch messages =============== **/
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchConversationMessages(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  /** =============== Send message =============== **/
  const { mutate: submitMessage, isPending: isSendingMessage } = useMutation({
    mutationFn: () => sendMessage(conversationId, message, userId),
    onSuccess: (newMessage) => {
      setMessage("");

      // Update messages cache
      queryClient.setQueryData<MessageType[]>(
        ["messages", conversationId],
        (old = []) => [...old, newMessage]
      );

      // Emit via socket
      socket.emit("privateRoomChat", {
        roomId: conversation?.roomId,
        msg: newMessage,
        senderId: userId,
      });

      queryClient.setQueryData(
        ["conversations"],
        (old: ConversationType[] = []) =>
          old.map((conversation: ConversationType) =>
            conversation._id === newMessage.conversationId
              ? {
                  ...conversation,
                  lastMessage: {
                    content: newMessage.content,
                    sender: userId,
                    createdAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : conversation
          )
      );
    },
    onError: () => toast("Failed to send message."),
  });

  /** =============== Message submit handler =============== **/
  const messageSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isSendingMessage) return;
    submitMessage();
  };

  /** =============== Scroll down to the last message =============== **/
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-[75vw] min-h-[30vh] h-dvh backdrop-blur-xl bg-white/15 dark:bg-black/30">
      {conversation && showMessages && (
        <MessagesPanelHeader
          photo={recipient?.photo}
          recipientName={recipient?.name}
          recipientInitials={recipient?.name?.slice(0, 2).toUpperCase()}
        />
      )}
      {showMessages && conversation ? (
        isError ? (
          <ResourcesLoaderContainer>
            <FailedResourcesLoadingLoader errorMessage="Error loading messages" />
          </ResourcesLoaderContainer>
        ) : isLoading ? (
          <ResourcesLoaderContainer>
            <Loader loaderText="Loading messages..." />
          </ResourcesLoaderContainer>
        ) : (
          <Fragment>
            <div className="px-7">
              <MessagesContainer
                userId={userId}
                messages={messages}
                messagesEndRef={messagesEndRef}
              />
            </div>
            <MessageSendingForm
              message={message}
              onSetMessage={setMessage}
              isSendingMessage={isSendingMessage}
              onSubmitMessageHandler={messageSubmitHandler}
            />
          </Fragment>
        )
      ) : (
        <MessagesPanelStartView />
      )}
    </div>
  );
};

export default ChatMessagesPanelSection;
