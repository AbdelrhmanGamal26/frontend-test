import MessagesPanelIcon from "@/assets/icons/MessagesPanelIcon";

const MessagesPanelStartView = () => {
  return (
    <div className="flex justify-center items-center h-dvh">
      <div className="flex-1 flex items-center justify-center bg-white/10 h-full">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-yellow-400/20 dark:from-emerald-600/30 dark:to-yellow-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-white/30 dark:border-emerald-500/30">
            <MessagesPanelIcon />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-emerald-50 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-600 dark:text-emerald-200">
              Choose a conversation from the list to start messaging or start a
              new one
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPanelStartView;
