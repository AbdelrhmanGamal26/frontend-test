import { Fragment } from "react";

const FailedResourcesLoadingLoader = ({
  errorMessage,
}: {
  errorMessage: string;
}) => {
  return (
    <Fragment>
      <p className="text-red-300 mb-3">{errorMessage}</p>
    </Fragment>
  );
};

export default FailedResourcesLoadingLoader;
