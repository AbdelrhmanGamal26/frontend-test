import React from "react";
import { MessageSquare } from "lucide-react";

const AuthFormContainer = ({
  children,
  authFormHeader,
}: {
  children: React.ReactNode;
  authFormHeader: React.ReactNode;
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 relative z-10">
      <div className="w-full max-w-md space-y-8 backdrop-blur-xl bg-white/20 dark:bg-black/30 p-8 rounded-3xl border border-white/30 dark:border-emerald-500/30 shadow-2xl">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-yellow-400 rounded-2xl shadow-lg backdrop-blur-sm">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          {authFormHeader}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer;
