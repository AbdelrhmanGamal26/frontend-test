import UserPhoto from "./UserPhoto";

const UserDataWithName = ({
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
        <UserPhoto
          src={photo}
          alt={alt}
          imgContainerClasses="w-[50px] h-[50px]"
        />
      ) : (
        <div className="w-[45px] h-[45px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {userInitials}
        </div>
      )}
      {userName && (
        <p className="text-gray-900 dark:text-emerald-50 text-[18px]">
          {userName}
        </p>
      )}
    </div>
  );
};

export default UserDataWithName;
