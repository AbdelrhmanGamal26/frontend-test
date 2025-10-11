import React from "react";

const AuthActionLinkContainer = ({
  children,
  containerClasses = "",
}: {
  children: React.ReactNode;
  containerClasses?: string;
}) => {
  return (
    <div className={`flex items-center gap-x-1 ${containerClasses}`}>
      {children}
    </div>
  );
};

export default AuthActionLinkContainer;
