import { Eye, EyeOff } from "lucide-react";

const TogglePasswordVisibility = ({
  showPassword,
  onSetShowPassword,
}: {
  showPassword?: boolean;
  onSetShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button
      type="button"
      onClick={() => onSetShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
    >
      {showPassword ? (
        <EyeOff className="eyeIconClasses" />
      ) : (
        <Eye className="eyeIconClasses" />
      )}
    </button>
  );
};

export default TogglePasswordVisibility;
