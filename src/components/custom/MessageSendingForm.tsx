import React from "react";
import { ConversationType } from "@/@types/general";

type MessageSendingForm = {
  message: string;
  room: ConversationType;
  onSetMessage: (value: React.SetStateAction<string>) => void;
  onSubmitMessageHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

const MessageSendingForm = ({
  room,
  message,
  onSetMessage,
  onSubmitMessageHandler,
}: MessageSendingForm) => {
  return (
    <form
      onSubmit={onSubmitMessageHandler}
      className="flex gap-x-3 pt-5 border-t-1 border-yellow-200"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => onSetMessage(e.target.value)}
        placeholder="Write your message"
        className={`placeholder:text-white text-white w-full border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-150 rounded-md px-2 text-md h-[40px] outline-none ${
          room ? "focus:border-green-500" : "opacity-50 cursor-not-allowed"
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
  );
};

export default MessageSendingForm;
