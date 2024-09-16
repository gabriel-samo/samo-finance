import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export function useConfirm(
  title: string,
  message: string
): [() => JSX.Element, () => Promise<unknown>] {
  // State to hold the promise resolve function, initially null
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  // Function to create a new promise and set the resolve function in state
  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  // Function to reset the promise state to null, effectively closing the dialog
  const handleClose = () => {
    setPromise(null);
  };

  // Function to resolve the promise with true (confirmation) and close the dialog
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  // Function to resolve the promise with false (cancellation) and close the dialog
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  // Component to render the confirmation dialog
  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Return the dialog component and the confirm function
  return [ConfirmationDialog, confirm];
}
