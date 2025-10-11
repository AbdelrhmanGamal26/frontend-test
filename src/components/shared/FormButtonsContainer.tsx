import React from "react";

const FormButtonsContainer = ({
  children,
  containerClasses = "",
}: {
  children: React.ReactNode;
  containerClasses?: string;
}) => {
  return (
    <div
      className={`w-full flex justify-end items-end gap-x-5 mt-10 ${containerClasses}`}
    >
      {children}
    </div>
  );
};

export default FormButtonsContainer;
