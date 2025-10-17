import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import TogglePasswordVisibility from "./TogglePasswordVisibility";

type LabeledInputFieldType = {
  id: string;
  required: boolean;
  labelName: string;
  placeholder: string;
  icon: React.ReactNode;
  labelClasses?: string;
  inputClasses?: string;
  inputFieldValue: string;
  fieldType?: "text" | "password";
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const LabeledInputField = ({
  id,
  icon,
  required,
  onChange,
  labelName,
  placeholder,
  inputFieldValue,
  fieldType = "text",
}: LabeledInputFieldType) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    fieldType === "password" ? (showPassword ? "text" : "password") : "text";

  return (
    <div className="flex flex-col items-between w-full mb-4">
      <Label htmlFor={id} className="mb-2">
        {labelName}
        <span className="text-red-500">{required && "*"}</span>
      </Label>
      <div className="relative">
        {icon}
        <Input
          id={id}
          type={inputType}
          onChange={onChange}
          value={inputFieldValue}
          placeholder={placeholder}
          className="pl-10 bg-white"
        />
        {fieldType === "password" && (
          <TogglePasswordVisibility
            showPassword={showPassword}
            onSetShowPassword={setShowPassword}
          />
        )}
      </div>
    </div>
  );
};

export default LabeledInputField;
