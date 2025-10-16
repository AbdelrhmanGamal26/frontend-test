export interface Member {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface LastMessage {
  content: string;
  sender: string;
  createdAt: Date;
}

export type ConversationType = {
  _id: string;
  roomId: string;
  members: Member[];
  lastMessage: LastMessage;
  createdAt: Date;
  updatedAt: Date;
};

export type MessageType = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface APIError {
  response?: {
    data?: { message?: string };
  };
  message?: string;
}
