// Import necessary dependencies and components
import { z } from "zod";

import { insertCategorySchema } from "@/db/schema";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

// Define the form schema using Zod, picking only the 'name' field from the insertCategorySchema
const formSchema = insertCategorySchema.pick({
  name: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// NewCategorySheet component for creating a new category
const NewCategorySheet = () => {
  // Use the custom hook to manage the sheet's open/close state
  const { isOpen, onClose } = useNewCategory();

  // Use the custom hook to handle category creation
  const mutation = useCreateCategory();

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Trigger the category creation mutation
    mutation.mutate(values, {
      // Close the sheet on successful category creation
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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        {/* Category creation form */}
        <CategoryForm
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

export default NewCategorySheet;
