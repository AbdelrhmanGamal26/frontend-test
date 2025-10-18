import { MoreVertical, Phone, Video } from "lucide-react";
import UserDataWithName from "../shared/UserDataWithName";
import { Button } from "../ui/button";

const MessagesPanelHeader = ({
  photo,
  recipientName,
  recipientInitials,
}: {
  photo: string | undefined;
  recipientName: string | undefined;
  recipientInitials: string | undefined;
}) => {
  return (
    <div className="w-full h-[80px] p-4 border-b border-white/20 dark:border-emerald-500/20 flex items-center justify-between backdrop-blur-sm bg-white/20 dark:bg-black/30">
      <UserDataWithName
        photo={photo}
        alt="User photo"
        userName={recipientName}
        userInitials={recipientInitials}
      />
      {/* this section is to be completed after working on the Audio and Video calls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm cursor-pointer"
        >
          <Phone className="w-5 h-5 text-gray-700 dark:text-emerald-300" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm cursor-pointer"
        >
          <Video className="w-5 h-5 text-gray-700 dark:text-emerald-300" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm cursor-pointer"
        >
          <MoreVertical className="w-5 h-5 text-gray-700 dark:text-emerald-300" />
        </Button>
      </div>
    </div>
  );
};

export default MessagesPanelHeader;
