import CustomDialog from "./CustomDialog";
import AddIcon from "@/assets/icons/AddIcon";
import StartChatIcon from "@/assets/icons/StartChatIcon";

type StartChatDialogButtonType = {
  open: boolean;
  contact: string;
  onSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSetContact: React.Dispatch<React.SetStateAction<string>>;
  onStartChatHandler: (e: React.FormEvent<HTMLFormElement>) => void;
};

const StartChatDialogButton = ({
  open,
  contact,
  onSetOpen,
  onSetContact,
  onStartChatHandler,
}: StartChatDialogButtonType) => {
  return (
    <div className="w-full flex justify-end mb-5">
      <CustomDialog
        open={open}
        setOpen={onSetOpen}
        trigger={
          <div className="flex items-center justify-center cursor-pointer w-fit h-fit rounded-full bg-transparent hover:bg-green-600 transition-all duration-200">
            <AddIcon />
          </div>
        }
        contentClassName="bg-green-600 !w-[1000px] h-[100px] border-none"
      >
        <form
          onSubmit={onStartChatHandler}
          className="flex justify-between gap-x-3"
        >
          <input
            type="email"
            value={contact}
            placeholder="Search contact"
            onChange={(e) => onSetContact(e.target.value)}
            className="border-1 text-white bg-orange-400 border-white hover:border-[#b6b6b6] transition-all duration-150 outline-none w-[67%] px-5 rounded-md"
          />
          <button
            type="submit"
            className="flex gap-x-2 items-center px-3 border-1 bg-orange-400 border-white hover:border-[#b6b6b6] transition-all duration-150 outline-none rounded-md text-white cursor-pointer"
          >
            <StartChatIcon />
            <p>Start Chat</p>
          </button>
        </form>
      </CustomDialog>
    </div>
  );
};

export default StartChatDialogButton;
