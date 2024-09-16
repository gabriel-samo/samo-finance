import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

// CategoryColumn component to display a category name and handle click events
// to open the category details or the transaction details if the category is not available.
// It uses the useOpenCategory and useOpenTransaction hooks to get the onOpenCategory
// and onOpenTransaction functions, which are called with the categoryId or id respectively
// when the div is clicked.
export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  // Destructure the onOpen function from the useOpenCategory hook and rename it to onOpenCategory
  const { onOpen: onOpenCategory } = useOpenCategory();
  // Destructure the onOpen function from the useOpenTransaction hook and rename it to onOpenTransaction
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  // Function to handle the click event and open the category details if categoryId is available,
  // otherwise open the transaction details
  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  };

  return (
    // Render a div with the category name, which is clickable and has a hover effect.
    // If the category is not available, display a warning icon and the text "Uncategorized"
    // with a red color.
    <div
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "text-rose-500"
      )}
    >
      {/* Display a warning icon if the category is not available */}
      {!category && <TriangleAlert className="size-4 mr-2 shrink-0" />}
      {/* Display the category name or "Uncategorized" if the category is not available */}
      {category || "Uncategorized"}
    </div>
  );
};
