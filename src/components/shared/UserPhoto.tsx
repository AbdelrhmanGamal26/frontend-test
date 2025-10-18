const UserPhoto = ({
  src,
  alt,
  imgContainerClasses = "",
}: {
  src: string;
  alt: string;
  imgContainerClasses?: string;
}) => {
  return (
    <div
      className={`w-[40px] h-[40px] rounded-full overflow-hidden ${imgContainerClasses}`}
    >
      <img src={src} alt={alt} className="w-full h-full object-fill" />
    </div>
  );
};

export default UserPhoto;
