const MessagesPanelHeader = ({
  recipientName,
  recipientInitials,
}: {
  recipientName: string | undefined;
  recipientInitials: string | undefined;
}) => {
  return (
    <div className="w-full h-[70px] bg-green-600 flex items-center px-5">
      <div className="flex items-center gap-x-2">
        <div className="w-[40px] h-[40px] text-white rounded-full bg-red-300 flex justify-center items-center">
          {recipientInitials}
        </div>
        <p className="text-white text-xl">{recipientName}</p>
      </div>
    </div>
  );
};

export default MessagesPanelHeader;
