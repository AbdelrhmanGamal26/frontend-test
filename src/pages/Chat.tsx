import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { RootState } from "@/store";
import socket from "@/websocket/socketHandler";
import AddIcon from "@/assets/images/icons/AddIcon";
import CustomDialog from "@/components/custom/CustomDialog";

import {
  sendMessage,
  getUserConversations,
  createOrJoinConversation,
  fetchConversationMessages,
} from "@/services/conversationServices";

interface Member {
  email: string;
  name: string;
  _id: string;
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
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  /** =============== 2. Fetch messages for current room =============== */
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", conversationIdRef.current],
    queryFn: () => fetchConversationMessages(conversationIdRef.current),
    enabled: !!conversationIdRef.current,
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
      queryClient.setQueryData<RoomType[]>(["conversations"], (old = []) => {
        const exists = old.some((c) => c._id === conversation._id);
        return exists ? old : [...old, conversation];
      });

      // Prefetch messages
      queryClient.prefetchQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => fetchConversationMessages(conversationId),
      });
    },
    onError: () => toast("No user found with that email."),
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

      // Refresh conversations list preview
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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

      // 🔹 Skip message if the sender is the current user
      if (data.msg.senderId === user.user?.userId) return;

      // Update messages cache
      queryClient.setQueryData<MessageType[]>(
        ["messages", data.msg.conversationId],
        (old = []) => [...old, data.msg]
      );

      // Optionally update conversations list preview
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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

  /** ======================================================== */

  const recipient = room?.members.find(
    (member: Member) => member._id !== user.user?.userId
  );

  /** =============== 8. Render =============== */
  return (
    <div className="flex justify-end">
      {/* Sidebar */}
      <div className="w-[30vw] bg-green-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-3xl text-white mb-1">Chats</h3>
          <div className="flex items-center gap-x-2">
            <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
              {user.user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-white text-xl">{user.user?.name}</p>
          </div>
        </div>

        <div className="flex flex-col h-[92%] justify-between">
          {/* Conversations */}
          <ul className="flex flex-col gap-y-4">
            {conversations.map((conversation) => {
              const recipientUser = conversation.members.find(
                (member: Member) => member._id !== user.user?.userId
              );

              return (
                <li
                  key={conversation._id}
                  className="flex items-center gap-x-2 w-full bg-green-300 hover:bg-green-500 px-2 py-4 rounded-md transition-all duration-200 cursor-pointer"
                  onClick={() => joinOrCreateRoom(recipientUser?.email || "")}
                >
                  <div className="w-[35px] h-[35px] text-white rounded-full bg-red-300 flex justify-center items-center">
                    {recipientUser?.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <p>{recipientUser?.name}</p>
                </li>
              );
            })}
          </ul>

          {/* Start Chat Dialog */}
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
                className="flex justify-between gap-x-5"
              >
                <input
                  type="email"
                  value={contact}
                  placeholder="Search contact"
                  onChange={(e) => setContact(e.target.value)}
                  className="border-1 text-white border-white outline-none w-full px-5 rounded-md"
                />
                <button
                  type="submit"
                  className="border-1 border-white outline-none rounded-md text-white"
                >
                  Start Chat
                </button>
              </form>
            </CustomDialog>
          </div>
        </div>
      </div>

      {/* Messages Panel */}
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
                className={`placeholder:text-white w-full border-2 border-yellow-200 rounded-md px-2 text-md h-[40px] outline-none ${
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
