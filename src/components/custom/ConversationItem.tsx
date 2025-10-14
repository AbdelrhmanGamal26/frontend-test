import { Member } from "@/@types/general";
import UserPhoto from "../shared/UserPhoto";

const ConversationItem = ({
  alt,
  photo,
  onClick,
  userInitials,
  recipientUser,
}: {
  alt: string;
  onClick: () => void;
  photo: string | undefined;
  userInitials: string | undefined;
  recipientUser: Member | undefined;
}) => {
  return (
    <li
      className="flex items-center gap-x-2 w-full h-[68px] bg-green-300 hover:bg-green-500 px-2 py-4 rounded-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {photo ? (
        <UserPhoto src={photo} alt={alt} />
      ) : (
        <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {userInitials}
        </div>
      )}
      <p>{recipientUser?.name ?? "Deleted user"}</p>
    </li>
  );
};

export default ConversationItem;
