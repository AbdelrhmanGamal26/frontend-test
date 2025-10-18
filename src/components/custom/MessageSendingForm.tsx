import React from "react";
import { Mic, Paperclip, Send } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type MessageSendingForm = {
  message: string;
  isSendingMessage: boolean;
  onSetMessage: (value: React.SetStateAction<string>) => void;
  onSubmitMessageHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

const MessageSendingForm = ({
  message,
  onSetMessage,
  isSendingMessage,
  onSubmitMessageHandler,
}: MessageSendingForm) => {
  return (
    <div className="px-5 py-3 border-t border-white/20 dark:border-emerald-500/20 backdrop-blur-sm bg-white/20 dark:bg-black/30">
      <form
        onSubmit={onSubmitMessageHandler}
        className="flex items-center gap-x-2"
      >
        <div className="flex-1 flex items-end gap-2 bg-white/40 dark:bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/30 dark:border-emerald-500/30">
          <Input
            type="text"
            value={message}
            placeholder="Type your message"
            onChange={(e) => onSetMessage(e.target.value)}
            className={`border-0 shadow-none outline-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 
                        px-0 placeholder:text-gray-500 dark:placeholder:text-emerald-400/60 text-gray-900 dark:text-emerald-50`}
          />
          <Button
            size="icon"
            type="button"
            variant="ghost"
            className="flex-shrink-0 h-8 w-8 hover:bg-white/30 dark:hover:bg-black/50"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-emerald-300" />
          </Button>
        </div>
        {/* this part will be completed when implementing the audio records */}
        {message.trim() ? (
          <Button
            size="icon"
            type="submit"
            disabled={!message.trim()}
            className={`rounded-full bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 flex-shrink-0 shadow-lg ${
              message.trim() || isSendingMessage
                ? "bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5 text-gray-600 dark:text-emerald-300" />
          </Button>
        ) : (
          <Button
            size="icon"
            type="button"
            variant="ghost"
            className="rounded-full bg-gradient-to-r from-emerald-500 to-yellow-400 hover:from-emerald-600 hover:to-yellow-500 flex-shrink-0 shadow-lg cursor-pointer transition-colors"
          >
            <Mic className="w-5 h-5 text-gray-600 dark:text-emerald-300" />
          </Button>
        )}
      </form>
    </div>
  );
};

export default MessageSendingForm;
