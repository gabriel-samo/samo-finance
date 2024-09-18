// Import necessary dependencies and components
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader2, TrashIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Select } from "@/component/select";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { Textarea } from "@/component/ui/textarea";
import { DatePicker } from "@/component/date-picker";
import { insertTransactionSchema } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";
import { AmountInput } from "@/component/amount-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/component/ui/form";

// Define the form schema using Zod, picking only the 'name' field from the insertTransactionsSchema
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional()
});

// Define the API schema by omitting the 'id' field from the insertTransactionSchema
const apiSchema = insertTransactionSchema.omit({ id: true });

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

// Define the props for the TransactionForm component
type Props = {
  id?: string; // Optional ID for existing transactions
  defaultValues?: FormValues; // Default form values
  onSubmit: (values: ApiFormValues) => void; // Function to handle form submission
  onDelete?: () => void; // Optional function to handle transaction deletion
  disabled?: boolean; // Flag to disable form inputs
  // Array of account options for the account dropdown/select input.
  // Each option has a 'label' (display name) and a 'value' (account ID).
  accountOptions: { label: string; value: string }[];
  // Array of category options for the category dropdown/select input.
  // Each option has a 'label' (display name) and a 'value' (category ID).
  categoryOptions: { label: string; value: string }[];
  // Function to handle the creation of a new account.
  // Takes the account name as a parameter and triggers the account creation mutation.
  onCreateAccount: (name: string) => void;
  // Function to handle the creation of a new category.
  // Takes the category name as a parameter and triggers the category creation mutation.
  onCreateCategory: (name: string) => void;
};

// TransactionForm component definition
export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory
}: Props) => {
  // Initialize the form using react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Use Zod for form validation
    defaultValues // Set default form values
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount); // Convert the amount from string to float
    const amountInMiliunits = convertAmountToMiliunits(amount); // Convert the amount to miliunits
    onSubmit({ ...values, amount: amountInMiliunits }); // Call the onSubmit function with the form values and converted amount
  };

  // Handle transaction deletion
  const handleDelete = () => {
    onDelete?.(); // Call the onDelete function if it exists
  };

  return (
    // Render the form using the Form component from shadcn/ui
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)} // Handle form submission
        className="space-y-4 pt-4"
      >
        {/* Date field */}
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value} // Set the value of the DatePicker to the form field value
                  onChange={field.onChange} // Update the form field value when the DatePicker value changes
                  disabled={disabled} // Disable the DatePicker if the form is disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Account selection field */}
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account" // Placeholder text for the Select component
                  options={accountOptions} // Options for the Select component
                  onCreate={onCreateAccount} // Function to handle the creation of a new account
                  value={field.value} // Set the value of the Select component to the form field value
                  onChange={field.onChange} // Update the form field value when the Select value changes
                  disabled={disabled} // Disable the Select component if the form is disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Category selection field */}
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category" // Placeholder text for the Select component
                  options={categoryOptions} // Options for the Select component
                  onCreate={onCreateCategory} // Function to handle the creation of a new category
                  value={field.value} // Set the value of the Select component to the form field value
                  onChange={field.onChange} // Update the form field value when the Select value changes
                  disabled={disabled} // Disable the Select component if the form is disabled
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Payee input field */}
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled} // Disable the Input component if the form is disabled
                  placeholder="Add a payee" // Placeholder text for the Input component
                  {...field} // Spread the form field props onto the Input component
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Amount input field */}
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field} // Spread the form field props onto the AmountInput component
                  disabled={disabled} // Disable the AmountInput component if the form is disabled
                  placeholder="0.00" // Placeholder text for the AmountInput component
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Notes input field */}
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field} // Spread the form field props onto the Textarea component
                  value={field.value ?? ""} // Set the value of the Textarea to the form field value or an empty string if the value is null or undefined
                  placeholder="Optional notes" // Placeholder text for the Textarea component
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Submit button */}
        <Button className="w-full" disabled={disabled}>
          {" "}
          {/* Full-width button */}
          {id ? "Save Changes" : "Create Transaction"}{" "}
          {/* Button text changes based on whether an ID is provided */}
          {disabled && <Loader2 className="size-4 ml-2 animate-spin" />}{" "}
          {/* Show a loading spinner if the form is disabled */}
        </Button>
        {/* Delete button (only shown for existing transactions) */}
        {!!id && (
          <Button
            type="button"
            disabled={disabled} // Disable the button if the form is disabled
            onClick={handleDelete} // Handle the delete action when the button is clicked
            className="w-full"
            variant="outline"
          >
            <TrashIcon className="size-4 mr-2" />{" "}
            {/* Trash icon for the delete button */}
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
