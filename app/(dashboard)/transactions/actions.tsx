"use client"; // This directive indicates that the code is running on the client side

// Import the custom hook to manage the open/close state of the account sheet
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";

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
  id: string; // ID of the account to be edited
};

// Actions component to render the dropdown menu with actions for each account row
export const Actions = ({ id }: Props) => {
  // Initialize the confirmation dialog and the confirm function
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure", // Title of the confirmation dialog
    "You are about to delete this account. This action cannot be undone." // Message in the confirmation dialog
  );
  // Initialize the delete mutation with the account ID
  const deleteMutation = useDeleteAccount(id);
  // Use the custom hook to get the function to open the account sheet
  const { onOpen } = useOpenAccount();

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
          {/* Dropdown menu item to edit the account */}
          <DropdownMenuItem
            disabled={deleteMutation.isPending} // Disable the item if the delete mutation is pending
            onClick={() => onOpen(id)} // Open the account sheet when clicked
          >
            <Edit className="size-4 mr-2" /> {/* Icon for edit action */}
            Edit
          </DropdownMenuItem>
          {/* Dropdown menu item to delete the account */}
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
