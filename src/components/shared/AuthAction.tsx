import CustomLink from "./CustomLink";
import AuthActionLinkContainer from "./AuthActionLinkContainer";

const AuthAction = ({
  to,
  linkTitle,
  actionTitle,
  linkClasses = "",
}: {
  to: string;
  linkTitle: string;
  actionTitle: string;
  linkClasses?: string;
}) => {
  return (
    <AuthActionLinkContainer>
      <p>{actionTitle}</p>
      <CustomLink
        to={to}
        title={linkTitle}
        linkClasses={`text-indigo-700 hover:!text-orange-200 !bg-transparent !w-fit ${linkClasses}`}
      />
    </AuthActionLinkContainer>
  );
};

export default AuthAction;
