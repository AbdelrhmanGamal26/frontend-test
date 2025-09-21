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
import AddIcon from "@/assets/images/icons/AddIcon";
import CustomDialog from "@/components/custom/CustomDialog";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import StartChatIcon from "@/assets/images/icons/StartChatIcon";

interface Member {
  email: string;
  name: string;
  _id: string;
}

type ConversationType = {
  _id: string;
  roomId: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

interface APIError {
  response?: {
    data?: { message?: string };
  };
  message?: string;
}

type RoomType = Awaited<ReturnType<typeof createOrJoinConversation>>;
type MessageType = Awaited<ReturnType<typeof fetchConversationMessages>>[0];

const Chat = () => {
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const [room, setRoom] = useState<RoomType | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState<Member | null>(null);

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
    refetchOnWindowFocus: true,
    staleTime: 10 * 1000,
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
    enabled: !!conversationIdRef.current,
    refetchOnWindowFocus: false,
  });

  /** =============== 3. Create or Join Conversation =============== */
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
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      // Add conversation to cache if missing
      queryClient.setQueryData<ConversationType[]>(
        ["conversations"],
        (old = []) => {
          const exists = old.some((c) => c._id === conversation._id);
          return exists ? old : [...old, conversation];
        }
      );

      // Prefetch messages
      queryClient.prefetchQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => fetchConversationMessages(conversationId),
      });
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
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    submitMessage();
  };

  const startChatHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinOrCreateRoom(contact);
    setOpen(false);
  };

  /** =============== 7. Auto-scroll to bottom =============== */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** ================== Properly wait for the recipient to be loaded ========================= */
  useEffect(() => {
    if (!room?.members?.length) {
      setRecipient(null);
      return;
    }

    const other = room.members.find((m: Member) => m._id !== user.user?.userId);

    setRecipient(other ?? null);
  }, [room, user.user?.userId]);

  /** =============== 8. Render =============== */
  return (
    <div className="flex justify-end">
      {/* Start of Sidebar */}
      <div className="w-[30vw] bg-green-700 px-5 py-4">
        {/* Start of Sidebar top part */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl text-white mb-1">Chats</h3>
          <div className="flex items-center gap-x-2">
            <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
              {user.user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-white text-xl">{user.user?.name}</p>
          </div>
        </div>
        {/* End of Sidebar top part */}

        {/* Start of Conversations */}
        <div className="flex flex-col h-[92%] justify-between">
          {isConversationsLoadingError ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-red-300 mb-3">Error loading conversations</p>
              <button
                onClick={() => refetchConversations()}
                className="text-white w-fit px-2 py-1 bg-green-500 hover:bg-green-700 border-2 border-yellow-300 rounded-md cursor-pointer"
              >
                load conversations
              </button>
            </div>
          ) : isConversationsLoading ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-white mb-3">Loading conversations...</p>
              <Spinner className="text-white" size={36} variant="bars" />
            </div>
          ) : (
            <ul className="flex flex-col gap-y-4">
              {conversations.length === 0 ? (
                <p className="text-white text-center mt-8">
                  Start a new conversation
                </p>
              ) : (
                conversations.map((conversation) => {
                  const recipientUser = conversation.members.find(
                    (member: Member) => member._id !== user.user?.userId
                  );

                  return (
                    <li
                      key={conversation._id}
                      className="flex items-center gap-x-2 w-full bg-green-300 hover:bg-green-500 px-2 py-4 rounded-md transition-all duration-200 cursor-pointer"
                      onClick={() =>
                        joinOrCreateRoom(recipientUser?.email || "")
                      }
                    >
                      <div className="w-[35px] h-[35px] text-white rounded-full bg-red-300 flex justify-center items-center">
                        {recipientUser?.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <p>{recipientUser?.name}</p>
                    </li>
                  );
                })
              )}
            </ul>
          )}
          {/* Start of Chat Dialog */}
          <div className="w-full flex justify-end">
            <CustomDialog
              open={open}
              setOpen={setOpen}
              trigger={
                <div className="flex items-center justify-center cursor-pointer w-fit h-fit rounded-full bg-transparent hover:bg-green-600 transition-all duration-200">
                  <AddIcon />
                </div>
              }
              contentClassName="bg-green-600 !w-[1000px] h-[100px] border-none"
            >
              <form
                onSubmit={startChatHandler}
                className="flex justify-between gap-x-3"
              >
                <input
                  type="email"
                  value={contact}
                  placeholder="Search contact"
                  onChange={(e) => setContact(e.target.value)}
                  className="border-1 text-white bg-orange-400 border-white hover:border-[#b6b6b6] transition-all duration-150 outline-none w-[67%] px-5 rounded-md"
                />
                <button
                  type="submit"
                  className="flex gap-x-2 items-center px-3 border-1 bg-orange-400 border-white hover:border-[#b6b6b6] transition-all duration-150 outline-none rounded-md text-white cursor-pointer"
                >
                  <StartChatIcon />
                  <p>Start Chat</p>
                </button>
              </form>
            </CustomDialog>
          </div>
          {/* End of Chat Dialog */}
        </div>
        {/* End of Conversations */}
      </div>
      {/* End of Sidebar */}

      {/* Start of Messages Panel */}
      <div className="w-[70vw] min-h-[30vh] h-dvh bg-gradient-to-b from-green-400 to-red-400">
        {room && showMessages && (
          <div className="w-full h-[70px] bg-green-600 flex items-center px-5">
            <div className="flex items-center gap-x-2">
              <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
                {recipient?.name?.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-white text-xl">{recipient?.name}</p>
            </div>
          </div>
        )}

        {showMessages && room ? (
          isMessagesLoadingError ? (
            <div className="w-full flex flex-col items-center">
              <p className="text-red-500 mb-3">Error loading messages</p>
              <button
                onClick={() => refetchMessages()}
                className="text-white w-fit px-2 py-1 bg-green-500 hover:bg-green-700 border-2 border-yellow-300 rounded-md cursor-pointer"
              >
                load messages
              </button>
            </div>
          ) : isLoadingMessages ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-white mb-3">loading messages...</p>
              <Spinner className="text-white" size={36} variant="bars" />
            </div>
          ) : (
            <div className="px-7">
              <div className="w-full h-[83vh] overflow-y-auto pb-5 pt-3">
                <ul id="messages" className="relative flex flex-col gap-y-2">
                  {messages.map((msg) => (
                    <li
                      key={msg._id}
                      className={`w-fit max-w-[450px] text-wrap break-words px-2 py-1 rounded-md ${
                        msg.senderId === user.user?.userId
                          ? "self-end bg-green-200"
                          : "self-start bg-blue-200"
                      }`}
                    >
                      {msg.content}
                    </li>
                  ))}
                  <div ref={messagesEndRef} />
                </ul>
              </div>

              <form
                onSubmit={submitHandler}
                className="flex gap-x-3 pt-5 border-t-1 border-yellow-200"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message"
                  className={`placeholder:text-white text-white w-full border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-150 rounded-md px-2 text-md h-[40px] outline-none ${
                    room
                      ? "focus:border-green-500"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`w-[150px] h-[40px] rounded-md outline-none ${
                    room && message.trim()
                      ? "bg-green-300 hover:bg-green-500 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </form>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-[92%]">
            <p className="text-2xl text-white">Start a conversation</p>
          </div>
        )}
      </div>
      {/* Start of Messages Panel */}
    </div>
  );
};

export default Chat;
