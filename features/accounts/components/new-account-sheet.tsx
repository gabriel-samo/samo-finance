// Import necessary dependencies and components
import { z } from "zod";

import { insertAccountSchema } from "@/db/schema";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/component/ui/sheet";

// Define the form schema using Zod, picking only the 'name' field from the insertAccountSchema
const formSchema = insertAccountSchema.pick({
  name: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// NewAccountSheet component for creating a new account
const NewAccountSheet = () => {
  // Use the custom hook to manage the sheet's open/close state
  const { isOpen, onClose } = useNewAccount();

  // Use the custom hook to handle account creation
  const mutation = useCreateAccount();

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Trigger the account creation mutation
    mutation.mutate(values, {
      // Close the sheet on successful account creation
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
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        {/* Account creation form */}
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: ""
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
