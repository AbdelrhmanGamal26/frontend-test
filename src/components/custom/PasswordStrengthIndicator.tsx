const PasswordStrengthIndicator = ({
  passwordLength,
}: {
  passwordLength: number;
}) => {
  const passwordStrength =
    passwordLength <= 4 ? "weak" : passwordLength <= 8 ? "medium" : "strong";

  return (
    <div className="flex gap-1 -mt-2.5 mb-4">
      <div
        className={`h-1 flex-1 rounded-full transition-colors ${
          passwordStrength === "weak"
            ? "bg-red-500"
            : passwordStrength === "medium"
            ? "bg-yellow-500"
            : "bg-green-500"
        }`}
      ></div>
      <div
        className={`h-1 flex-1 rounded-full transition-colors ${
          passwordStrength === "medium" || passwordStrength === "strong"
            ? passwordStrength === "medium"
              ? "bg-yellow-500"
              : "bg-green-500"
            : "bg-gray-200"
        }`}
      ></div>
      <div
        className={`h-1 flex-1 rounded-full transition-colors ${
          passwordStrength === "strong" ? "bg-green-500" : "bg-gray-200"
        }`}
      ></div>
    </div>
  );
};

export default PasswordStrengthIndicator;
