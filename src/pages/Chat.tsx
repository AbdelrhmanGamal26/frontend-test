import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { RootState } from "@/store";
import axiosInstance from "@/lib/axios";
import socket from "@/websocket/socketHandler";
import AddIcon from "@/assets/images/icons/AddIcon";
import CustomDialog from "@/components/custom/CustomDialog";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "@/constants/general";

interface Member {
  email: string;
  name: string;
  _id: string;
}

type RoomType = {
  _id: string;
  roomId: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

type MessageType = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type ConversationType = {
  _id: string;
  roomId: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

const Chat = () => {
  const user = useSelector((state: RootState) => state.user);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const conversationIdRef = useRef<string>("");
  const roomIdRef = useRef<string>(roomId);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const handleEscPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setRoom(null);
      setRoomId("");
      conversationIdRef.current = "";
      setMessages([]);
      socket.emit("leaveRoom", { roomId: roomIdRef.current });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscPress);

    return () => {
      document.removeEventListener("keydown", handleEscPress);
    };
  }, [handleEscPress]);

  useEffect(() => {
    const getUserConversations = async () => {
      try {
        const response = await axiosInstance.get(
          `${BACKEND_RESOURCES.CONVERSATIONS}`
        );

        if (response.status === RESPONSE_STATUSES.SUCCESS) {
          setConversations(response.data?.data?.conversations);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserConversations();
  }, []);

  const joinOrCreateRoom = async (recipientEmail: string) => {
    try {
      const response = await axiosInstance.post(
        `${BACKEND_RESOURCES.CONVERSATIONS}`,
        { recipientEmail }
      );

      if (response.status === RESPONSE_STATUSES.CREATED) {
        const conversation = response.data?.data?.conversation || {};
        const newRoomId = conversation.roomId || "";

        socket.connect();
        socket.emit("joinRoom", { roomId: newRoomId });

        setRoomId(newRoomId);
        setRoom(conversation);
        conversationIdRef.current = conversation._id;

        // Fetch existing messages
        const res = await axiosInstance.get(
          `${BACKEND_RESOURCES.MESSAGES}?conversationId=${conversation._id}`
        );
        if (res.status === RESPONSE_STATUSES.SUCCESS) {
          setMessages(res.data?.data?.messages || []);
        }
      }
    } catch (error) {
      toast("No user found with that email.");
      console.error("Error creating/joining conversation:", error);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!room || !roomId) {
      toast("Please select a conversation first.");
      return;
    }

    // emitting send message event
    try {
      const response = await axiosInstance.post(
        `${BACKEND_RESOURCES.MESSAGES}`,
        {
          conversationId: conversationIdRef.current,
          message,
          senderId: user.user?.userId,
        }
      );

      if (response.status === RESPONSE_STATUSES.CREATED) {
        setMessages((prev) => [...prev, response.data?.data?.message]);

        socket.emit("privateRoomChat", {
          roomId: room?.roomId,
          msg: response.data?.data?.message,
        });
        setMessage(""); // Clear input
      }
    } catch (error) {
      console.log(error);
      toast("Failed to send message.");
    }
  };

  useEffect(() => {
    const handleIncomingMessage = (data: {
      roomId: string;
      msg: MessageType & { senderId: string };
    }) => {
      if (data.roomId !== roomIdRef.current) return;

      // Skip if this message is from the current user (already optimistically added)
      if (data.msg.senderId === user.user?.userId) return;

      setMessages((prev) => [...prev, data.msg]);
    };

    socket.on("privateRoomChat", handleIncomingMessage);

    return () => {
      socket.off("privateRoomChat", handleIncomingMessage); // cleanup on unmount
    };
  }, []);

  const startChatHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    joinOrCreateRoom(contact);

    setOpen(false);
  };

  const recipient = room?.members.filter(
    (member) => member._id !== user.user?.userId
  );

  // scroll to bottom ref
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-end">
      <div className="w-[30vw] bg-green-700 p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-3xl text-white mb-1">Chats</h3>
          <div className="flex items-center gap-x-2">
            <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
              {user.user?.name.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-white text-xl">{user.user?.name}</p>
          </div>
        </div>
        <div className="flex flex-col h-[92%] justify-between">
          <ul className="flex flex-col gap-y-4">
            {conversations.map((conversation) => {
              const recipientUser = conversation.members.filter(
                (member) => member._id !== user.user?.userId
              )[0];

              return (
                <li
                  key={conversation._id}
                  className="flex items-center gap-x-2 w-full bg-green-300 hover:bg-green-500 px-2 py-4 rounded-md transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    joinOrCreateRoom(recipientUser?.email);
                  }}
                >
                  <div className="w-[35px] h-[35px] text-white rounded-full bg-red-300 flex justify-center items-center">
                    {recipientUser?.name.slice(0, 2).toUpperCase()}
                  </div>
                  <p>{recipientUser?.name}</p>
                </li>
              );
            })}
          </ul>
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
                  placeholder="search contact"
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
      <div className="w-[70vw] min-h-[30vh] h-dvh bg-gradient-to-b from-green-400 to-red-400">
        <div className="w-full h-[70px] bg-green-600 flex items-center px-5">
          {room && recipient && (
            <div className="flex items-center gap-x-2">
              <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
                {recipient[0].name.slice(0, 2).toUpperCase() ?? ""}
              </div>
              <p className="text-white text-xl">{recipient[0].name ?? ""}</p>
            </div>
          )}
        </div>
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
            <div className="flex flex-col items-between w-full">
              <input
                type="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message"
                className={`placeholder:text-white border-2 border-yellow-200 rounded-md px-2 text-md h-[40px] outline-none ${
                  room
                    ? "focus:border-green-500"
                    : "opacity-50 cursor-not-allowed"
                }`}
              />
            </div>
            <div className="flex gap-x-5">
              <button
                type="submit"
                disabled={message.trim() === ""}
                className={`w-[150px] h-[40px] rounded-md outline-none ${
                  room && message.trim() !== ""
                    ? "bg-green-300 hover:bg-green-500 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
