import { Member } from "@/@types/general";

const ConversationItem = ({
  key,
  onClick,
  recipientUser,
}: {
  key: string;
  onClick: () => void;
  recipientUser: Member | undefined;
}) => {
  return (
    <li
      key={key}
      className="flex items-center gap-x-2 w-full bg-green-300 hover:bg-green-500 px-2 py-4 rounded-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-[35px] h-[35px] text-white rounded-full bg-red-300 flex justify-center items-center">
        {recipientUser?.name?.slice(0, 2).toUpperCase()}
      </div>
      <p>{recipientUser?.name}</p>
    </li>
  );
};

export default ConversationItem;
