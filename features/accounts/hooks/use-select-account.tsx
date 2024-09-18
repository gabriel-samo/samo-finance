import { useRef, useState } from "react";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { Select } from "@/component/select";
import { Button } from "@/component/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/component/ui/dialog";

// Custom hook to handle account selection with a confirmation dialog
export function useSelectAccount(): [
  () => JSX.Element,
  () => Promise<unknown>
] {
  // Fetch accounts using custom hook
  const accountQuery = useGetAccounts();
  // Create account mutation hook
  const accountMutatoin = useCreateAccount();
  // Function to handle account creation
  const onCreateAccount = (name: string) => accountMutatoin.mutate({ name });
  // Map account data to options for the select component
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  // State to manage the promise for confirmation
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  // Ref to store the selected value
  const selectValue = useRef<string>();

  // Function to initiate the confirmation process
  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  // Function to handle dialog close
  const handleClose = () => {
    setPromise(null);
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  // Function to handle cancellation
  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  // Component to render the confirmation dialog
  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>
            Please select an account to continue.
          </DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select an account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => (selectValue.current = value)}
          disabled={accountQuery.isLoading || accountMutatoin.isPending}
        />
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
