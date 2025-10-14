const FormHeader = ({
  title,
  headerClasses = "",
}: {
  title: string;
  headerClasses?: string;
}) => {
  return (
    <h2
      className={`text-2xl text-center mb-5 w-full text-indigo-700 font-bold ${headerClasses}`}
    >
      {title}
    </h2>
  );
};

export default FormHeader;
