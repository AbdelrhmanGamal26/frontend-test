import React from "react";

const AuthFormContainer = ({
  children,
  containerClasses = "",
}: {
  children: React.ReactNode;
  containerClasses?: string;
}) => {
  return (
    <div
      className={`flex-col w-[28vw] min-h-[25vh] bg-gradient-to-b from-green-400 to-red-400 px-7 py-5 rounded-4xl ${containerClasses}`}
    >
      {children}
    </div>
  );
};

export default AuthFormContainer;
