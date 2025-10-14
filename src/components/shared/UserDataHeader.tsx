import UserPhoto from "./UserPhoto";

const UserDataHeader = ({
  alt,
  photo,
  userName,
  userInitials,
}: {
  alt: string;
  photo: string | undefined;
  userName: string | undefined;
  userInitials: string | undefined;
}) => {
  return (
    <div className="flex items-center gap-x-2">
      {photo ? (
        <UserPhoto src={photo} alt={alt} />
      ) : (
        <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {userInitials}
        </div>
      )}
      <p className="text-white text-xl">{userName}</p>
    </div>
  );
};

export default UserDataHeader;
