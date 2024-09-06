// Import necessary dependencies and components
import { z } from "zod";
import { Loader2, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountsSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

// Define the form schema using Zod, picking only the 'name' field from the insertAccountsSchema
const formSchema = insertAccountsSchema.pick({
  name: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// Define the props for the AccountForm component
type Props = {
  id?: string; // Optional ID for existing accounts
  defaultValues?: FormValues; // Default form values
  onSubmit: (values: FormValues) => void; // Function to handle form submission
  onDelete?: () => void; // Optional function to handle account deletion
  disabled?: boolean; // Flag to disable form inputs
};

// AccountForm component definition
export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
}: Props) => {
  // Initialize the form using react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // Use Zod for form validation
    defaultValues // Set default form values
  });

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  // Handle account deletion
  const handleDelete = () => {
    onDelete?.();
  };

  return (
    // Render the form using the Form component from shadcn/ui
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        {/* Form field for account name */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Cash, Bank, Credit Card"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Submit button */}
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Account"}
          {disabled && <Loader2 className="size-4 ml-2 animate-spin" />}
        </Button>
        {/* Delete button (only shown for existing accounts) */}
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <TrashIcon className="size-4 mr-2" />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};
