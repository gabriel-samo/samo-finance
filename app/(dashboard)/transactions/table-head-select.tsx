import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Define the type for the component props
type Props = {
  columnIndex: number; // Index of the column being selected
  selectedColumns: Record<string, string | null>; // Object containing the selected columns
  onChange: (columnIndex: number, value: string | null) => void; // Function to handle the change in selection
};

// Options available for selection in the dropdown
const options = ["amount", "payee", "date"];

// TableHeadSelect component to render a dropdown for selecting column headers
export const TableHeadSelect = ({
  columnIndex,
  selectedColumns,
  onChange
}: Props) => {
  // Get the current selection for the given column index
  const currentSelection = selectedColumns[`column_${columnIndex}`];
  return (
    <Select
      value={currentSelection || ""} // Set the value of the select to the current selection or an empty string if not selected
      onValueChange={(value) => onChange(columnIndex, value)} // Handle the change in selection
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize", // Styling for the select trigger
          currentSelection && "text-blue-500" // Apply text color if a selection is made
        )}
      >
        <SelectValue placeholder="Skip" />{" "}
        {/* Placeholder text for the select */}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>{" "}
        {/* Option to skip the column */}
        {options.map((option, index) => {
          // Determine if the option should be disabled
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column_${columnIndex}`] !== option;
          return (
            <SelectItem
              key={index} // Unique key for each option
              value={option} // Value of the option
              disabled={disabled} // Disable the option if it is already selected in another column
              className="capitalize" // Apply capitalization styling
            >
              {option} {/* Display the option text */}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
