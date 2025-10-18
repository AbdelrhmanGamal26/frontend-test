import { Link } from "react-router";
import UserPhoto from "./UserPhoto";

const UserDataWithoutName = ({
  alt,
  photo,
  userInitials,
}: {
  alt: string;
  photo: string | undefined;
  userInitials: string | undefined;
}) => {
  return (
    <Link
      to="/profile"
      className="flex items-center gap-x-2 cursor-pointer group rounded-full hover:ring-4 hover:ring-green-500 transition-all duration-300 ease-out"
    >
      {photo ? (
        <UserPhoto src={photo} alt={alt} />
      ) : (
        <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {userInitials}
        </div>
      )}
    </Link>
  );
};

export default UserDataWithoutName;
