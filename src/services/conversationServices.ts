import axiosInstance from "@/lib/axios";
import { BACKEND_RESOURCES, RESPONSE_STATUSES } from "@/constants/general";
import { ConversationType, MessageType } from "@/@types/general";

// create a new conversation or join existing one
export const createOrJoinConversation = async (
  recipientEmail: string
): Promise<ConversationType> => {
  const response = await axiosInstance.post(
    `${BACKEND_RESOURCES.CONVERSATIONS}`,
    { recipientEmail }
  );

  if (response.status !== RESPONSE_STATUSES.CREATED) {
    throw new Error("Failed to create/join conversation");
  }

  return response.data?.data?.conversation;
};

// get user conversations
export const getUserConversations = async () => {
  const response = await axiosInstance.get(
    `${BACKEND_RESOURCES.CONVERSATIONS}`
  );

  if (response.status !== RESPONSE_STATUSES.SUCCESS) {
    throw new Error("Failed to fetch conversations.");
  }

  return response.data?.data?.conversations as ConversationType[];
};

// get conversation messages
export const fetchConversationMessages = async (
  conversationId: string
): Promise<MessageType[]> => {
  const res = await axiosInstance.get(
    `${BACKEND_RESOURCES.MESSAGES}?conversationId=${conversationId}`
  );

  if (res.status !== RESPONSE_STATUSES.SUCCESS) {
    throw new Error("Failed to fetch messages.");
  }

  return res.data?.data?.messages;
};

export const sendMessage = async (
  conversationId: string,
  message: string,
  senderId: string
) => {
  const response = await axiosInstance.post(`${BACKEND_RESOURCES.MESSAGES}`, {
    conversationId,
    message,
    senderId,
  });

  if (response.status !== RESPONSE_STATUSES.CREATED) {
    throw new Error("Failed to send message");
  }

  return response.data?.data?.message as MessageType;
};
