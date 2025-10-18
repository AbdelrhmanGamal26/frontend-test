import { MessageType } from "@/@types/general";
import { formatFullMessageDateTime } from "@/lib/utils";

const MessagesContainer = ({
  userId,
  messages,
  messagesEndRef,
}: {
  messages: MessageType[];
  userId: string | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div className="w-full h-[83vh] overflow-y-auto pb-5 pt-3">
      <ul id="messages" className="relative flex flex-col gap-y-1">
        {messages.map((msg) => (
          <li
            key={msg._id}
            className={`w-fit min-w-[175px] max-w-[450px] text-wrap break-words px-2 py-1 rounded-2xl backdrop-blur-sm ${
              msg.senderId === userId
                ? "bg-gradient-to-r from-emerald-500 to-yellow-400 text-white rounded-br-md shadow-md self-end"
                : "bg-white/60 dark:bg-black/50 text-gray-900 dark:text-emerald-50 rounded-bl-md border border-white/30 dark:border-emerald-500/30 shadow-md self-start"
            }`}
          >
            <p className="text-start">{msg.content}</p>
            <p className="text-[12px] text-end">
              {formatFullMessageDateTime(new Date(msg.createdAt))}
            </p>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
};

export default MessagesContainer;
