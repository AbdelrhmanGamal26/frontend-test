export interface Member {
  email: string;
  name: string;
  _id: string;
}

export type ConversationType = {
  _id: string;
  roomId: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

export interface APIError {
  response?: {
    data?: { message?: string };
  };
  message?: string;
}
