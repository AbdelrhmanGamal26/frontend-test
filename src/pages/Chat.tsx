import { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@/store";
import socket from "@/websocket/socketHandler";
import { createOrJoinConversation } from "@/services/conversationServices";
import GlassmorphismBackground from "@/components/shared/GlassmorphismBackground";
import {
  Member,
  MessageType,
  ConversationType,
  APIError,
} from "@/@types/general";
import ChatMessagesPanelSection from "@/components/custom/ChatMessagesPanelSection";
import ChatConversationsListSection from "@/components/custom/ChatConversationsListSection";

const Chat = () => {
  const [conversation, setConversation] = useState<ConversationType | null>(
    null
  );
  const [showMessages, setShowMessages] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const conversationIdRef = useRef<string>("");
  const roomIdRef = useRef<string>("");

  /** =============== Handle ESC to leave room =============== **/
  const handleEscPress = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      socket.emit("leaveRoom", { roomId: roomIdRef.current });
      setSelectedConversationId("");
      setConversation(null);
      setShowMessages(false);

      conversationIdRef.current = "";
      roomIdRef.current = "";
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleEscPress);
    return () => document.removeEventListener("keydown", handleEscPress);
  }, [handleEscPress]);

  /** =============== Create or Join Conversation =============== **/
  const handleJoinRoom = (conversation: ConversationType) => {
    setConversation(conversation);
    setSelectedConversationId(conversation._id);
    setShowMessages(true);

    const conversationId = conversation._id;
    const newRoomId = conversation.roomId;

    conversationIdRef.current = conversationId;
    roomIdRef.current = newRoomId;

    // Connect socket and join room
    socket.connect();
    socket.emit("joinRoom", { roomId: newRoomId });
  };

  const { mutate: joinOrCreateRoom } = useMutation({
    mutationFn: createOrJoinConversation,
    onSuccess: (conversation: ConversationType) => {
      handleJoinRoom(conversation);

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

  /** =============== Join user room on login =============== **/
  useEffect(() => {
    if (user.user?.userId) {
      // Connect socket and join user's personal room
      socket.connect();
      socket.emit("joinUserRoom", { userId: user.user.userId });

      return () => {
        socket.disconnect();
      };
    }
  }, [user.user?.userId]);

  /** =============== Socket Listener for Incoming Messages =============== **/
  useEffect(() => {
    const handleIncomingMessage = (data: {
      roomId: string;
      msg: MessageType;
    }) => {
      if (data.roomId !== conversation?.roomId) return;

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
                  lastMessage: {
                    content: data.msg.content,
                    sender: user.user!.userId,
                    createdAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : conversation
          )
      );
    };

    socket.on("privateRoomChat", handleIncomingMessage);
    return () => {
      socket.off("privateRoomChat", handleIncomingMessage);
    };
  }, [conversation?.roomId, user.user, queryClient]);

  /** ================== Wait for the recipient to be loaded ========================= **/
  const recipient = conversation?.members.find(
    (member: Member) => member._id !== user.user?.userId
  );

  /** ================== Listen for new conversations (FIRST MESSAGE ONLY) ========================= **/
  useEffect(() => {
    if (!socket) return;

    const handleNewConversationWithMessage = (data: {
      conversation: ConversationType;
      message: MessageType;
    }) => {
      console.log("New conversation received (first message):", data);

      const { conversation, message } = data;

      // Add conversation to list with first message
      queryClient.setQueryData<ConversationType[]>(
        ["conversations"],
        (old = []) => {
          const exists = old.some((c) => c._id === conversation._id);

          if (!exists) {
            // Add new conversation with first message
            return [
              {
                ...conversation,
                lastMessage: {
                  content: message.content,
                  sender: user.user!.userId,
                  createdAt: new Date(),
                },
                updatedAt: new Date(),
              },
              ...old,
            ];
          }

          return old;
        }
      );

      // Show notification
      const sender = conversation.members.find(
        (m: Member) => m._id !== user.user?.userId
      );
      toast.info(`New message from ${sender?.name || "Someone"}!`);
    };

    // This event is emitted ONLY for the first message
    socket.on("newConversationWithMessage", handleNewConversationWithMessage);

    return () => {
      socket.off(
        "newConversationWithMessage",
        handleNewConversationWithMessage
      );
    };
  }, [queryClient, user.user]);

  return (
    <div
      className="flex bg-gradient-to-br from-emerald-400 via-green-500 to-yellow-400
               dark:from-emerald-900 dark:via-green-950 dark:to-yellow-900 relative overflow-hidden"
    >
      <GlassmorphismBackground />
      <ChatConversationsListSection
        user={user}
        conversation={conversation}
        handleJoinRoom={handleJoinRoom}
        joinOrCreateRoom={joinOrCreateRoom}
        selectedConversationId={selectedConversationId}
        onSetSelectedConversationId={setSelectedConversationId}
      />
      <ChatMessagesPanelSection
        recipient={recipient}
        userId={user.user!.userId}
        showMessages={showMessages}
        conversation={conversation}
        conversationId={conversationIdRef.current}
      />
    </div>
  );
};

export default Chat;
