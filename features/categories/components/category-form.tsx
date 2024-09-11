// Import necessary dependencies and components
import { z } from "zod";
import { Loader2, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";

// Define the form schema using Zod, picking only the 'name' field from the insertCategorySchema
const formSchema = insertCategorySchema.pick({
  name: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// Define the props for the CategoryForm component
type Props = {
  id?: string; // Optional ID for existing categories
  defaultValues?: FormValues; // Default form values
  onSubmit: (values: FormValues) => void; // Function to handle form submission
  onDelete?: () => void; // Optional function to handle category deletion
  disabled?: boolean; // Flag to disable form inputs
};

// CategoryForm component definition
export const CategoryForm = ({
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

  // Handle category deletion
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
        {/* Form field for category name */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Travel, etc."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Submit button */}
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Category"}
          {disabled && <Loader2 className="size-4 ml-2 animate-spin" />}
        </Button>
        {/* Delete button (only shown for existing categories) */}
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <TrashIcon className="size-4 mr-2" />
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};

/*
  Detailed Comments for Future Reference:

  1. formSchema: This schema is defined using Zod and picks only the 'name' field from the insertCategoriesSchema.
     It ensures that the form data structure is correctly typed and validated.

  2. FormValues: This type is inferred from the formSchema and represents the structure of the form values.
     It ensures that the form values are correctly typed.

  3. Props: This type defines the props for the CategoryForm component.
     - id: An optional string representing the category ID for existing categories.
     - defaultValues: An optional object representing the default form values.
     - onSubmit: A function to handle form submission, which takes the form values as a parameter.
     - onDelete: An optional function to handle category deletion.
     - disabled: A boolean flag to disable form inputs.

  4. CategoryForm Component: This component is designed to handle the category creation and editing functionality.
     - It initializes the form using react-hook-form with Zod for validation and default values.
     - handleSubmit: This function is called when the form is submitted and triggers the onSubmit prop with the form values.
     - handleDelete: This function is called when the delete button is clicked and triggers the onDelete prop if provided.
     - The form is rendered using the Form component from shadcn/ui, with fields for category name, submit button, and delete button.
     - The submit button text changes based on whether the id prop is provided (indicating an existing category).
     - The delete button is only shown if the id prop is provided.

  5. FormField: This component is used to render the form field for the category name.
     - It uses the control from react-hook-form to manage the form state.
     - The Input component is used for the input field, with a placeholder and disabled state based on the disabled prop.

  6. Button: This component is used for the submit and delete buttons.
     - The submit button is disabled based on the disabled prop and shows a loading spinner if disabled.
     - The delete button is only shown for existing categories (when the id prop is provided) and triggers the handleDelete function when clicked.
*/
