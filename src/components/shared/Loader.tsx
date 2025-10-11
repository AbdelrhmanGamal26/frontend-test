import { Fragment } from "react";
import { Spinner } from "../ui/shadcn-io/spinner";

const Loader = ({
  loaderText,
  variant = "bars",
}: {
  loaderText: string;
  variant?:
    | "default"
    | "bars"
    | "ring"
    | "circle"
    | "pinwheel"
    | "ellipsis"
    | "infinite"
    | "circle-filled"
    | undefined;
}) => {
  return (
    <Fragment>
      <p className="text-white mb-3">{loaderText}</p>
      <Spinner className="text-white" size={36} variant={variant} />
    </Fragment>
  );
};

export default Loader;
