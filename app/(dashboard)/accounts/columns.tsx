"use client";

// Import necessary types and components
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Actions } from "./actions";
import { client } from "@/lib/hono";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Define the type for the response data from the API
export type ResponseType = InferResponseType<
  typeof client.api.accounts.$get,
  200
>["data"][0];

// Define the columns for the table
export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select", // Column ID for row selection
    header: ({ table }) => (
      // Header checkbox to select/deselect all rows on the current page
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || // Check if all rows on the page are selected
          (table.getIsSomePageRowsSelected() && "indeterminate") // Check if some rows on the page are selected
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} // Toggle selection of all rows on the page
        aria-label="Select all" // Accessibility label
      />
    ),
    cell: ({ row }) => (
      // Checkbox for individual row selection
      <Checkbox
        checked={row.getIsSelected()} // Check if the row is selected
        onCheckedChange={(value) => row.toggleSelected(!!value)} // Toggle selection of the row
        aria-label="Select row" // Accessibility label
      />
    ),
    enableSorting: false, // Disable sorting for this column
    enableHiding: false // Disable hiding for this column
  },
  {
    accessorKey: "name", // Accessor key for the 'name' field
    header: ({ column }) => {
      return (
        // Button to toggle sorting for the 'name' column
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggle sorting direction
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Icon indicating sorting */}
        </Button>
      );
    }
  },
  {
    id: "actions", // Column ID for actions
    cell: ({ row }) => <Actions id={row.original.id} /> // Render actions for each row
  }
];
