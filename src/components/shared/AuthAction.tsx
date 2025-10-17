import CustomLink from "./CustomLink";
import AuthActionLinkContainer from "./AuthActionLinkContainer";

const AuthAction = ({
  to,
  linkTitle,
  actionTitle,
  linkClasses = "",
  containerClasses = "",
}: {
  to: string;
  linkTitle: string;
  actionTitle: string;
  linkClasses?: string;
  containerClasses?: string;
}) => {
  return (
    <AuthActionLinkContainer containerClasses={containerClasses}>
      <p className="text-white">{actionTitle}</p>
      <CustomLink
        to={to}
        title={linkTitle}
        linkClasses={`text-yellow-200 hover:text-yellow-300 transition-colors !bg-transparent !w-fit ${linkClasses}`}
      />
    </AuthActionLinkContainer>
  );
};

export default AuthAction;
