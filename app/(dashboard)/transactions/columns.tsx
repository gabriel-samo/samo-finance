"use client";
// Import necessary types and components
import { format } from "date-fns";
import { InferResponseType } from "hono";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { client } from "@/lib/hono";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Actions } from "./actions";
import { AccountColumn } from "./account-column";
import { CategoryColumn } from "./category-column";

// Define the type for the response data from the API
export type ResponseType = InferResponseType<
  typeof client.api.transactions.$get,
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
    accessorKey: "date", // Accessor key for the 'name' field
    header: ({ column }) => {
      return (
        // Button to toggle sorting for the 'name' column
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggle sorting direction
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Icon indicating sorting */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      return <span>{format(date, "dd/MM/yyyy")}</span>;
    }
  },
  {
    accessorKey: "category", // Accessor key for the 'name' field
    header: ({ column }) => {
      return (
        // Button to toggle sorting for the 'name' column
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggle sorting direction
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Icon indicating sorting */}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <CategoryColumn
          id={row.original.id}
          category={row.original.category}
          categoryId={row.original.categoryId}
        />
      );
    }
  },
  {
    accessorKey: "payee", // Accessor key for the 'name' field
    header: ({ column }) => {
      return (
        // Button to toggle sorting for the 'name' column
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggle sorting direction
        >
          Payee
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Icon indicating sorting */}
        </Button>
      );
    }
  },
  {
    accessorKey: "amount", // Accessor key for the 'name' field
    header: ({ column }) => {
      return (
        // Button to toggle sorting for the 'name' column
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggle sorting direction
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Icon indicating sorting */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <Badge
          variant={amount > 0 ? "primary" : "destructive"}
          className="text-xs font-medium px-3.5 py-2.5"
        >
          {formatCurrency(amount)}
        </Badge>
      );
    }
  },
  {
    accessorKey: "account", // Accessor key for the 'name' field
    header: ({ column }) => {
      return (
        // Button to toggle sorting for the 'name' column
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggle sorting direction
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          {/* Icon indicating sorting */}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <AccountColumn
          account={row.original.account}
          accountId={row.original.accountId}
        />
      );
    }
  },
  {
    id: "actions", // Column ID for actions
    cell: ({ row }) => <Actions id={row.original.id} /> // Render actions for each row
  }
];
