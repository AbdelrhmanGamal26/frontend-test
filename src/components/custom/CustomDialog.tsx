import React, { JSX } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface CustomDialogTypes {
  open: boolean;
  trigger: JSX.Element;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  triggerClasses?: string;
  contentClassName?: string;
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
      <DialogTrigger className={`${triggerClasses} py-[6px] flex items-center`}>
        {trigger}
      </DialogTrigger>
      <DialogContent className={contentClassName}>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
