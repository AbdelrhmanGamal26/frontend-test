import { Link } from "react-router";

type CustomLinkType = {
  to: string;
  title: string;
  linkClasses?: string;
};

const CustomLink = ({ to, title, linkClasses = "" }: CustomLinkType) => {
  return (
    <Link className={linkClasses} to={to}>
      {title}
    </Link>
  );
};

export default CustomLink;
