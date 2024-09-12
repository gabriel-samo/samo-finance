// Import necessary dependencies and components
import { z } from "zod";

import { insertAccountSchema } from "@/db/schema";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";

import { useConfirm } from "@/hooks/use-confirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

// Define the form schema using Zod, picking only the 'name' field from the insertAccountSchema
const formSchema = insertAccountSchema.pick({
  name: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// EditAccountSheet component for editing an existing account
const EditAccountSheet = () => {
  // Use the custom hook to manage the sheet's open/close state and get the account ID
  const { isOpen, onClose, id } = useOpenAccount();

  // Initialize the confirmation dialog with a message and description
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account. This action cannot be undone."
  );

  // Use the custom hook to fetch the account data based on the ID
  const accountQuery = useGetAccount(id);
  // Use the custom hook to handle account editing
  const editMutation = useEditAccount(id);
  // Use the custom hook to handle account deletion
  const deleteMutation = useDeleteAccount(id);

  // Determine if any mutation is pending or if the account data is loading
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = accountQuery.isLoading;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Trigger the account edit mutation
    editMutation.mutate(values, {
      // Close the sheet on successful account edit
      onSuccess: () => {
        onClose();
      }
    });
  };

  // Handle account deletion
  const onDelete = async () => {
    // Show the confirmation dialog and wait for user response
    const ok = await confirm();

    if (ok) {
      // Trigger the account delete mutation
      deleteMutation.mutate(undefined, {
        // Close the sheet on successful account deletion
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  // Set default form values based on the fetched account data
  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name
      }
    : {
        name: ""
      };

  return (
    <>
      {/* Render the confirmation dialog */}
      <ConfirmDialog />
      {/* Render the sheet component with open state and onOpenChange handler */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 overflow-clip">
          {/* Decorative background elements */}
          <div className="relative">
            <div
              style={{ zIndex: -1 }}
              className="absolute top-0 -left-4 size-44 md:size-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-first"
            ></div>
            <div
              style={{ zIndex: -1 }}
              className="absolute top-16 -right-4 size-44 md:size-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-forth animation-delay-2000"
            ></div>
          </div>
          {/* Sheet header with title and description */}
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            // Show a loading spinner while the account data is being fetched
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            /* Account form for editing the account */
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;
