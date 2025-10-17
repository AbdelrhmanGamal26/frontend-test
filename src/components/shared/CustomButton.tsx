import { Button } from "../ui/button";
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
    <Button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={buttonClasses}
    >
      {isLoading ? (
        <Spinner className="text-white" size={24} variant="circle" />
      ) : (
        title
      )}
    </Button>
  );
};

export default CustomButton;
