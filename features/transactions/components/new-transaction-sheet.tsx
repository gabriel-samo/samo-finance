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
