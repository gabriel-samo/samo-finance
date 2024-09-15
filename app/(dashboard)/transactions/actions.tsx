"use client"; // This directive indicates that the code is running on the client side

// Import the custom hook to manage the open/close state of the transaction sheet
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

// Import icons and UI components
import { Edit, MoreHorizontal, Trash } from "lucide-react"; // Icons for the edit action and more options
import { Button } from "@/components/ui/button"; // Button component
import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu, // Dropdown menu component
  DropdownMenuContent, // Content of the dropdown menu
  DropdownMenuItem, // Individual item in the dropdown menu
  DropdownMenuTrigger // Trigger to open the dropdown menu
} from "@/components/ui/dropdown-menu";

// Define the type for the component props
type Props = {
  id: string; // ID of the transaction to be edited
};

// Actions component to render the dropdown menu with actions for each transaction row
export const Actions = ({ id }: Props) => {
  // Initialize the confirmation dialog and the confirm function
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure", // Title of the confirmation dialog
    "You are about to delete this transaction. This action cannot be undone." // Message in the confirmation dialog
  );
  // Initialize the delete mutation with the transaction ID
  const deleteMutation = useDeleteTransaction(id);
  // Use the custom hook to get the function to open the transaction sheet
  const { onOpen } = useOpenTransaction();

  // Function to handle the delete action
  const handleDelete = async () => {
    const ok = await confirm(); // Show the confirmation dialog and wait for user response
    if (ok) {
      deleteMutation.mutate(); // If confirmed, trigger the delete mutation
    }
  };

  return (
    <>
      <ConfirmDialog /> {/* Render the confirmation dialog */}
      <DropdownMenu>
        {/* Trigger button for the dropdown menu */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" /> {/* Icon for more options */}
          </Button>
        </DropdownMenuTrigger>
        {/* Content of the dropdown menu */}
        <DropdownMenuContent align="end">
          {/* Dropdown menu item to edit the transaction */}
          <DropdownMenuItem
            disabled={deleteMutation.isPending} // Disable the item if the delete mutation is pending
            onClick={() => onOpen(id)} // Open the transaction sheet when clicked
          >
            <Edit className="size-4 mr-2" /> {/* Icon for edit action */}
            Edit
          </DropdownMenuItem>
          {/* Dropdown menu item to delete the transaction */}
          <DropdownMenuItem
            disabled={deleteMutation.isPending} // Disable the item if the delete mutation is pending
            onClick={handleDelete} // Handle the delete action when clicked
          >
            <Trash className="size-4 mr-2" /> {/* Icon for delete action */}
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
