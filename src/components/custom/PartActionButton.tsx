interface PartActionButtonTypes {
  bgColor: string;
  onClick: () => void;
  textContent: string;
}

const PartActionButton = ({
  bgColor,
  onClick,
  textContent,
}: PartActionButtonTypes) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-[8vw] md:w-auto h-[22px] md:h-[32px] ${bgColor} rounded-md outline-0 px-2 py-1 text-white cursor-pointer transition-all duration-150`}
    >
      {textContent}
    </button>
  );
};

export default PartActionButton;
