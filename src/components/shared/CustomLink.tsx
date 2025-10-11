import { Link } from "react-router";

type CustomLinkType = {
  to: string;
  title: string;
  linkClasses?: string;
};

const CustomLink = ({ to, title, linkClasses = "" }: CustomLinkType) => {
  return (
    <Link
      className={`w-[5vw] py-1 flex justify-center items-center text-indigo-700 bg-yellow-200 hover:bg-green-500 transition-all duration-200 rounded-md cursor-pointer ${linkClasses}`}
      to={to}
    >
      {title}
    </Link>
  );
};

export default CustomLink;
