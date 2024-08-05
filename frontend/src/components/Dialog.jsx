import { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { Button } from "./Button";

export const Dialog = ({ open, setOpen, onConfirm, description, children }) => {
  const dialogRef = useRef();
  const closeDialog = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    closeDialog();
  };

  useClickOutside(dialogRef, closeDialog);

  return (
    <div
      className={`${
        open ? "flex" : "hidden"
      } w-full h-full fixed inset-0 bg-black/80 z-50 justify-center items-center`}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg w-fit h-fit flex flex-col gap-6 items-center justify-center p-8 relative"
      >
        <button className="absolute top-4 right-4" onClick={closeDialog}>
          &#10005;
        </button>
        {!children ? (
          <>
            <div className="text-2xl font-bold text-red-500">
              Are you sure
            </div>
            <div className="text-center font-medium opacity-60">
              {description}
            </div>
            <div className="flex gap-3 text-white font-medium">
              <button
                className="bg-red-500 py-2 px-4 rounded-md hover:bg-opacity-70 transition-all"
                onClick={handleConfirm}
              >
                Yes
              </button>
              <Button variant="black" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
