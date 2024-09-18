"use client"; // This directive indicates that the code is running on the client side

// Import the custom hook to manage the open/close state of the category sheet
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";

// Import icons and UI components
import { Edit, MoreHorizontal, Trash } from "lucide-react"; // Icons for the edit action and more options
import { Button } from "@/component/ui/button"; // Button component
import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu, // Dropdown menu component
  DropdownMenuContent, // Content of the dropdown menu
  DropdownMenuItem, // Individual item in the dropdown menu
  DropdownMenuTrigger // Trigger to open the dropdown menu
} from "@/component/ui/dropdown-menu";

// Define the type for the component props
type Props = {
  id: string; // ID of the category to be edited
};

// Actions component to render the dropdown menu with actions for each category row
export const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "You are about to delete this category. This action cannot be undone."
  );
  const deleteMutation = useDeleteCategory(id);
  // Use the custom hook to get the function to open the category sheet
  const { onOpen } = useOpenCategory();

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        {/* Trigger button for the dropdown menu */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" /> {/* Icon for more options */}
          </Button>
        </DropdownMenuTrigger>
        {/* Content of the dropdown menu */}
        <DropdownMenuContent align="end">
          {/* Dropdown menu item to edit the category */}
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" /> {/* Icon for edit action */}
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" /> {/* Icon for edit action */}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
