import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage,
  getUserConversations,
  createOrJoinConversation,
  fetchConversationMessages,
} from "@/services/conversationServices";
import { RootState } from "@/store";
import socket from "@/websocket/socketHandler";
import Loader from "@/components/shared/Loader";
import { APIError, ConversationType, Member } from "@/@types/general";
import ConversationsList from "@/components/custom/ConversationsList";
import MessagesContainer from "@/components/custom/MessagesContainer";
import MessageSendingForm from "@/components/custom/MessageSendingForm";
import MessagesPanelHeader from "@/components/custom/MessagesPanelHeader";
import SidebarHeaderContent from "@/components/custom/SidebarHeaderContent";
import StartChatDialogButton from "@/components/custom/StartChatDialogButton";
import ResourcesLoaderContainer from "@/components/shared/ResourcesLoaderContainer";
import FailedResourcesLoadingLoader from "@/components/shared/FailedResourcesLoadingLoader";

export type RoomType = Awaited<ReturnType<typeof createOrJoinConversation>>;

export type MessageType = Awaited<
  ReturnType<typeof fetchConversationMessages>
>[0];

const Chat = () => {
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [open, setOpen] = useState(false);

  const conversationIdRef = useRef<string>("");
  const roomIdRef = useRef<string>("");

  /** =============== Handle ESC to leave room =============== */
  const handleEscPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      socket.emit("leaveRoom", { roomId: roomIdRef.current });

      setRoom(null);
      setShowMessages(false);
      conversationIdRef.current = "";
      roomIdRef.current = "";
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscPress);
    return () => document.removeEventListener("keydown", handleEscPress);
  }, [handleEscPress]);

  /** =============== 1. Fetch user conversations =============== */
  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
    isError: isConversationsLoadingError,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  /** =============== 2. Fetch messages for current room =============== */
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    isError: isMessagesLoadingError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", conversationIdRef.current],
    queryFn: () => fetchConversationMessages(conversationIdRef.current),
    // enabled: !!conversationIdRef.current,
    enabled: !!conversationIdRef.current,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  /** =============== 3. Create or Join Conversation =============== */
  const handleConversationClick = useCallback(
    (conversation: ConversationType) => {
      // Set room directly without making API call (conversation already exists)
      setRoom(conversation);
      setShowMessages(true);

      const conversationId = conversation._id;
      const newRoomId = conversation.roomId;
      conversationIdRef.current = conversationId;
      roomIdRef.current = newRoomId;

      // Connect socket and join room
      socket.connect();
      socket.emit("joinRoom", { roomId: newRoomId });

      // No need to invalidate or refetch conversations - they're already loaded
      // The messages useQuery will automatically fetch when conversationIdRef updates
    },
    []
  );

  const { mutate: joinOrCreateRoom } = useMutation({
    mutationFn: createOrJoinConversation,
    onSuccess: (conversation) => {
      setRoom(conversation);
      setShowMessages(true);

      const conversationId = conversation._id;
      const newRoomId = conversation.roomId;
      conversationIdRef.current = conversationId;
      roomIdRef.current = newRoomId;

      // Connect socket and join room
      socket.connect();
      socket.emit("joinRoom", { roomId: newRoomId });

      // Refresh conversations list preview
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      // Add conversation to cache if missing
      queryClient.setQueryData<ConversationType[]>(
        ["conversations"],
        (old = []) => {
          const exists = old.some((c) => c._id === conversation._id);
          return exists ? old : [...old, conversation];
        }
      );
    },
    onError: (err: APIError) => {
      const message =
        err?.response?.data?.message || // Express/Node typical
        err?.message || // JS/Network error
        "No user found with that ID";
      toast(message);
    },
  });

  /** =============== 4. Send Message =============== */
  const { mutate: submitMessage } = useMutation({
    mutationFn: () =>
      sendMessage(conversationIdRef.current, message, user.user!.userId),
    onSuccess: (newMessage) => {
      setMessage("");

      // Update messages cache
      queryClient.setQueryData<MessageType[]>(
        ["messages", conversationIdRef.current],
        (old = []) => [...old, newMessage]
      );

      // Emit via socket
      socket.emit("privateRoomChat", {
        roomId: room?.roomId,
        msg: newMessage,
      });

      queryClient.setQueryData(
        ["conversations"],
        (old: ConversationType[] = []) =>
          old.map((conversation: ConversationType) =>
            conversation._id === newMessage.conversationId
              ? {
                  ...conversation,
                  lastMessage: newMessage.content,
                  updatedAt: new Date().toISOString(),
                }
              : conversation
          )
      );
    },
    onError: () => toast("Failed to send message."),
  });

  /** =============== 5. Socket Listener for Incoming Messages =============== */
  useEffect(() => {
    const handleIncomingMessage = (data: {
      roomId: string;
      msg: MessageType;
    }) => {
      if (data.roomId !== room?.roomId) return;

      // Skip message if the sender is the current user
      if (data.msg.senderId === user.user?.userId) return;

      // Update messages cache
      queryClient.setQueryData<MessageType[]>(
        ["messages", data.msg.conversationId],
        (old = []) => [...old, data.msg]
      );

      // Update conversations list preview
      queryClient.setQueryData(
        ["conversations"],
        (old: ConversationType[] = []) =>
          old.map((conversation: ConversationType) =>
            conversation._id === data.msg.conversationId
              ? {
                  ...conversation,
                  lastMessage: data.msg.content,
                  updatedAt: new Date().toISOString(),
                }
              : conversation
          )
      );
    };

    socket.on("privateRoomChat", handleIncomingMessage);
    return () => {
      socket.off("privateRoomChat", handleIncomingMessage);
    };
  }, [room?.roomId, user.user?.userId, queryClient]);

  /** =============== 6. Handlers =============== */
  const messageSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    submitMessage();
  };

  const startChatHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContact("");
    joinOrCreateRoom(contact);
    setOpen(false);
  };

  /** =============== 7. Auto-scroll to bottom =============== */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** ================== Properly wait for the recipient to be loaded ========================= */
  const recipient = room?.members.find(
    (m: Member) => m._id !== user.user?.userId
  );

  /** =============== 8. Render =============== */
  return (
    <div className="flex">
      <div className="w-[30vw] bg-green-700 px-5 pt-2 pb-4">
        <div className="flex justify-between item-center bg-green-700 px-2 py-4 mb-4">
          <SidebarHeaderContent
            userName={user.user?.name}
            userInitials={user.user?.name?.slice(0, 2).toUpperCase()}
          />
        </div>
        <div className="flex flex-col h-[92%] justify-between">
          {isConversationsLoadingError ? (
            <ResourcesLoaderContainer>
              <FailedResourcesLoadingLoader
                actionTitle="load conversations"
                onClick={() => refetchConversations()}
                errorMessage="Error loading conversations"
              />
            </ResourcesLoaderContainer>
          ) : isConversationsLoading ? (
            <ResourcesLoaderContainer>
              <Loader loaderText="Loading conversations..." />
            </ResourcesLoaderContainer>
          ) : (
            <ConversationsList
              user={user}
              conversations={conversations}
              onConversationClick={handleConversationClick}
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
      <div className="w-[70vw] min-h-[30vh] h-dvh bg-gradient-to-b from-green-400 to-red-400">
        {room && showMessages && (
          <MessagesPanelHeader
            recipientName={recipient?.name}
            recipientInitials={recipient?.name?.slice(0, 2).toUpperCase()}
          />
        )}
        {showMessages && room ? (
          isMessagesLoadingError ? (
            <ResourcesLoaderContainer>
              <FailedResourcesLoadingLoader
                actionTitle="load messages"
                onClick={() => refetchMessages()}
                errorMessage="Error loading messages"
              />
            </ResourcesLoaderContainer>
          ) : isLoadingMessages ? (
            <ResourcesLoaderContainer>
              <Loader loaderText="Loading messages..." />
            </ResourcesLoaderContainer>
          ) : (
            <div className="px-7">
              <MessagesContainer
                messages={messages}
                userId={user.user?.userId}
                messagesEndRef={messagesEndRef}
              />
              <MessageSendingForm
                room={room}
                message={message}
                onSetMessage={setMessage}
                onSubmitMessageHandler={messageSubmitHandler}
              />
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-[92%]">
            <p className="text-2xl text-white">Start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
