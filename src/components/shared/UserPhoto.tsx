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
    <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-fill ${imgContainerClasses}`}
      />
    </div>
  );
};

export default UserPhoto;
