// Import necessary dependencies and components
import { z } from "zod";

import { insertTransactionSchema } from "@/db/schema";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { useConfirm } from "@/hooks/use-confirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/component/ui/sheet";
import { Loader2 } from "lucide-react";

// Define the form schema using Zod, picking only the 'name' field from the insertTransactionSchema
const formSchema = insertTransactionSchema.omit({
  id: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// EditTransactionSheet component for editing an existing transaction
const EditTransactionSheet = () => {
  // Use the custom hook to manage the sheet's open/close state and get the transaction ID
  const { isOpen, onClose, id } = useOpenTransaction();

  // Initialize the confirmation dialog with a message and description
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction. This action cannot be undone."
  );

  // Use the custom hook to fetch the transaction data based on the ID
  const transactionQuery = useGetTransaction(id);
  // Use the custom hook to handle transaction editing
  const editMutation = useEditTransaction(id);
  // Use the custom hook to handle transaction deletion
  const deleteMutation = useDeleteTransaction(id);

  // Fetch categories using the custom hook
  const categoryQuery = useGetCategories();
  // Mutation to create a new category
  const categoryMutation = useCreateCategory();
  // Function to handle category creation
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  // Map category data to options for a dropdown or select input
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }));

  // Fetch accounts using the custom hook
  const accountQuery = useGetAccounts();
  // Mutation to create a new account
  const accountMutation = useCreateAccount();
  // Function to handle account creation
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  // Map account data to options for a dropdown or select input
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  // Determine if any mutation is pending or if the transaction data is loading
  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Trigger the transaction edit mutation
    editMutation.mutate(values, {
      // Close the sheet on successful transaction edit
      onSuccess: () => {
        onClose();
      }
    });
  };

  // Handle transaction deletion
  const onDelete = async () => {
    // Show the confirmation dialog and wait for user response
    const ok = await confirm();

    if (ok) {
      // Trigger the transaction delete mutation
      deleteMutation.mutate(undefined, {
        // Close the sheet on successful transaction deletion
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  // Set default form values based on the fetched transaction data
  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: ""
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
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            // Show a loading spinner while the transaction data is being fetched
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            /* Transaction form for editing the transaction */
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;

/*
  Detailed Comments for Future Reference:

  1. formSchema: This schema is defined using Zod and is based on the insertTransactionSchema, 
     but it omits the 'id' field. This schema is used to validate the form values.

  2. FormValues: This type is derived from the formSchema and represents the structure of the form values.

  3. EditTransactionSheet Component: This component is responsible for rendering the sheet to edit an existing transaction.
     - It uses the useOpenTransaction hook to manage the open/close state of the sheet and get the transaction ID.
     - It initializes a confirmation dialog using the useConfirm hook.

  4. Data Fetching and Mutations:
     - useGetTransaction: Fetches the transaction data based on the ID.
     - useEditTransaction: Handles the mutation for editing the transaction.
     - useDeleteTransaction: Handles the mutation for deleting the transaction.
     - useGetCategories: Fetches the list of categories.
     - useCreateCategory: Handles the mutation for creating a new category.
     - useGetAccounts: Fetches the list of accounts.
     - useCreateAccount: Handles the mutation for creating a new account.

  5. Category and Account Options:
     - categoryOptions: Maps the fetched category data to options for a dropdown or select input.
     - accountOptions: Maps the fetched account data to options for a dropdown or select input.

  6. isPending and isLoading:
     - isPending: Determines if any mutation is pending or if the transaction data is loading.
     - isLoading: Determines if the transaction, category, or account data is loading.

  7. onSubmit: Handles the form submission by triggering the editMutation. 
     On successful transaction edit, it closes the sheet.

  8. onDelete: Handles the transaction deletion by showing a confirmation dialog. 
     If the user confirms, it triggers the deleteMutation. On successful transaction deletion, it closes the sheet.

  9. defaultValues: Sets the default form values based on the fetched transaction data. 
     If the transaction data is not available, it sets default empty values.

  10. JSX Structure:
      - Renders the confirmation dialog.
      - Renders the sheet component with open state and onOpenChange handler.
      - Displays a loading spinner if the transaction data is being fetched.
      - Renders the TransactionForm component for editing the transaction with the necessary props.
*/
