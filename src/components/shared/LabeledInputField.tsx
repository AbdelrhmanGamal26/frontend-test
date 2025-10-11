type LabeledInputFieldType = {
  id: string;
  labelName: string;
  fieldType?: string;
  placeholder: string;
  labelClasses?: string;
  inputClasses?: string;
  inputFieldValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const LabeledInputField = ({
  id,
  onChange,
  labelName,
  placeholder,
  inputFieldValue,
  labelClasses = "",
  inputClasses = "",
  fieldType = "text",
}: LabeledInputFieldType) => {
  return (
    <div className="flex flex-col items-between w-full mb-3">
      <label
        htmlFor={id}
        className={`mb-1 ms-[2px] text-lg font-bold text-indigo-700 ${labelClasses}`}
      >
        {labelName}
      </label>
      <input
        type={fieldType}
        id={id}
        value={inputFieldValue}
        placeholder={placeholder}
        onChange={onChange}
        className={`border-2 border-yellow-200 rounded-md px-2 text-md h-[2.5vw] outline-none focus:border-green-500 focus:placeholder:text-transparent ${inputClasses}`}
      />
    </div>
  );
};

export default LabeledInputField;
