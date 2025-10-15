import { Spinner } from "../ui/shadcn-io/spinner";

type CustomButtonType = {
  title: string;
  isLoading: boolean;
  onClick?: () => void;
  buttonClasses?: string;
  type?: "submit" | "reset" | "button" | undefined;
};

const CustomButton = ({
  title,
  onClick,
  isLoading,
  type = "button",
  buttonClasses = "",
}: CustomButtonType) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-[5vw] px-1 py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer ${buttonClasses}`}
    >
      {isLoading ? (
        <Spinner className="text-indigo-700" size={24} variant="circle" />
      ) : (
        title
      )}
    </button>
  );
};

export default CustomButton;
