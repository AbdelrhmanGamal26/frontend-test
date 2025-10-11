import React, { JSX } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface CustomDialogTypes {
  open: boolean;
  trigger: JSX.Element;
  triggerClasses?: string;
  contentClassName?: string;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomDialog = ({
  open,
  trigger,
  setOpen,
  children,
  triggerClasses = "",
  contentClassName = "",
}: CustomDialogTypes) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={`${triggerClasses} py-[6px] flex items-center outline-none`}
      >
        {trigger}
      </DialogTrigger>
      <DialogContent className={contentClassName} showCloseButton={false}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
