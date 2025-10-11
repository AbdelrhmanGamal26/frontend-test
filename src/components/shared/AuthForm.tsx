import React from "react";

const AuthForm = ({
  children,
  onSubmit,
  formClasses = "",
}: {
  formClasses?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) => {
  return (
    <form onSubmit={onSubmit} className={`flex-col h-full ${formClasses}`}>
      {children}
    </form>
  );
};

export default AuthForm;
