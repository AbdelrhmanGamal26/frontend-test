import { Fragment } from "react";

const FailedResourcesLoadingLoader = ({
  onClick,
  actionTitle,
  errorMessage,
}: {
  onClick: () => void;
  actionTitle: string;
  errorMessage: string;
}) => {
  return (
    <Fragment>
      <p className="text-red-300 mb-3">{errorMessage}</p>
      <button
        onClick={onClick}
        className="text-white w-fit px-2 py-1 bg-green-500 hover:bg-green-700 border-2 border-yellow-300 rounded-md cursor-pointer"
      >
        {actionTitle}
      </button>
    </Fragment>
  );
};

export default FailedResourcesLoadingLoader;
