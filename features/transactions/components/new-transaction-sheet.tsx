// Import necessary dependencies and components
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { insertTransactionSchema } from "@/db/schema";

import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

// Define the form schema using Zod, omitting the 'id' field from the insertTransactionSchema
const formSchema = insertTransactionSchema.omit({
  id: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// NewTransactionSheet component for creating a new transaction
const NewTransactionSheet = () => {
  // Use the custom hook to manage the sheet's open/close state
  const { isOpen, onClose } = useNewTransaction();

  // Use the custom hook to handle transaction creation
  const createMutation = useCreateTransaction();

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

  // Determine if any mutation is pending
  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  // Determine if any query is loading
  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Trigger the transaction creation mutation
    createMutation.mutate(values, {
      // Close the sheet on successful transaction creation
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
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
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>
        {/* Transaction creation form */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;

// Detailed Comments for Future Reference:

/*
1. formSchema: This schema is defined using Zod and is based on the insertTransactionSchema. 
   The 'id' field is omitted as it is not required for creating a new transaction.

2. FormValues: This type is derived from the formSchema and represents the structure of the form values.

3. NewTransactionSheet Component:
   - This component is responsible for rendering the sheet that allows users to create a new transaction.
   - It uses the useNewTransaction hook to manage the open/close state of the sheet.
   - It uses the useCreateTransaction hook to handle the creation of a new transaction.

4. Category and Account Data:
   - The component fetches categories and accounts using the useGetCategories and useGetAccounts hooks respectively.
   - It also provides functionality to create new categories and accounts using the useCreateCategory and useCreateAccount hooks.
   - The fetched categories and accounts are mapped to options for dropdown or select inputs in the form.

5. isPending and isLoading:
   - isPending: This boolean value determines if any mutation (create transaction, create category, create account) is pending.
   - isLoading: This boolean value determines if any query (fetch categories, fetch accounts) is loading.

6. onSubmit Function:
   - This function handles the form submission.
   - It triggers the createMutation to create a new transaction.
   - On successful creation, it closes the sheet.

7. JSX Structure:
   - The component renders a Sheet with a SheetContent that contains the form.
   - If the data is loading, a loading spinner is displayed.
   - Otherwise, the TransactionForm component is rendered with the necessary props.
*/
