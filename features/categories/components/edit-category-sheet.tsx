// Import necessary dependencies and components
import { z } from "zod";

import { insertCategorySchema } from "@/db/schema";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";

import { useConfirm } from "@/hooks/use-confirm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

// Define the form schema using Zod, picking only the 'name' field from the insertCategorySchema
const formSchema = insertCategorySchema.pick({
  name: true
});

// Define the type for form values based on the schema
type FormValues = z.input<typeof formSchema>;

// EditCategorySheet component for editing an existing category
const EditCategorySheet = () => {
  // Use the custom hook to manage the sheet's open/close state and get the category ID
  const { isOpen, onClose, id } = useOpenCategory();

  // Initialize the confirmation dialog with a message and description
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category. This action cannot be undone."
  );

  // Use the custom hook to fetch the category data based on the ID
  const categoryQuery = useGetCategory(id);
  // Use the custom hook to handle category editing
  const editMutation = useEditCategory(id);
  // Use the custom hook to handle category deletion
  const deleteMutation = useDeleteCategory(id);

  // Determine if any mutation is pending or if the category data is loading
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Trigger the category edit mutation
    editMutation.mutate(values, {
      // Close the sheet on successful category edit
      onSuccess: () => {
        onClose();
      }
    });
  };

  // Handle category deletion
  const onDelete = async () => {
    // Show the confirmation dialog and wait for user response
    const ok = await confirm();

    if (ok) {
      // Trigger the category delete mutation
      deleteMutation.mutate(undefined, {
        // Close the sheet on successful category deletion
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  // Set default form values based on the fetched category data
  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name
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
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            // Show a loading spinner while the category data is being fetched
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            /* Category form for editing the category */
            <CategoryForm
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

export default EditCategorySheet;
