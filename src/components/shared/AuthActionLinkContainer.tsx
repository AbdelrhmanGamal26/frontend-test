import React from "react";

const AuthActionLinkContainer = ({
  children,
  containerClasses = "",
}: {
  children: React.ReactNode;
  containerClasses?: string;
}) => {
  return (
    <div className={`flex items-center gap-x-1 mb-2 ${containerClasses}`}>
      {children}
    </div>
  );
};

export default AuthActionLinkContainer;
