type CustomButtonType = {
  title: string;
  buttonClasses?: string;
  type: "submit" | "reset" | "button" | undefined;
};

const CustomButton = ({
  title,
  type = "button",
  buttonClasses = "",
}: CustomButtonType) => {
  return (
    <button
      type={type}
      className={`w-[5vw] px-1 py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer ${buttonClasses}`}
    >
      {title}
    </button>
  );
};

export default CustomButton;
