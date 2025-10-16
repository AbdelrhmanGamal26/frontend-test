export interface Member {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export type ConversationType = {
  _id: string;
  roomId: string;
  members: Member[];
  lastMessage: {
    content: string;
    sender: string;
    createdAt: Date;
  };
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
