import React from "react";

const ResourcesLoaderContainer = ({
  children,
  loaderClasses = "",
}: {
  loaderClasses?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center ${loaderClasses}`}
    >
      {children}
    </div>
  );
};

export default ResourcesLoaderContainer;
