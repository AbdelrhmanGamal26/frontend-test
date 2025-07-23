import PartActionButton from "./PartActionButton";

interface DeleteItemOverlayContentTypes {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clickHandler: () => void;
}

const DeleteItemOverlayContent = ({
  setOpen,
  clickHandler,
}: DeleteItemOverlayContentTypes) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h5>Delete Item</h5>
      <p className="mb-3">Are You Sure To Delete This Item?</p>
      <div className="flex gap-x-4">
        <PartActionButton
          bgColor="bg-red-400 hover:bg-red-700"
          onClick={() => setOpen(false)}
          textContent="Cancel"
        />
        <PartActionButton
          bgColor="bg-green-400 hover:bg-green-700"
          onClick={() => clickHandler()}
          textContent="Confirm"
        />
      </div>
    </div>
  );
};

export default DeleteItemOverlayContent;
