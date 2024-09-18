import { useState } from "react";
import { format, parse } from "date-fns";

import { Button } from "@/component/ui/button";
import { convertAmountToMiliunits } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";

import { ImportTable } from "./import-table";

// Define date formats for parsing and formatting dates
const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

// Define the required columns for the import process
const requiredOptions = ["amount", "date", "payee"];

// Define the state interface for selected columns
interface SelectedColumnsState {
  [key: string]: string | null;
}

// Define the props for the ImportCard component
type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

// ImportCard component for handling the import process
export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  // State to keep track of selected columns
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  );

  // Extract headers and body from the data
  const headers = data[0];
  const body = data.slice(1);

  // Handle changes in table head selection
  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };
      // Ensure that each column can only be selected once
      for (const key in newSelectedColumns) {
        // If the value is already selected, set it to null
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      // If the value is "skip", set it to null
      if (value === "skip") {
        value = null;
      }

      // Set the selected column
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  // Calculate the progress of the required columns selection
  const progress = Object.values(selectedColumns).filter(Boolean).length;

  // Handle the continue button click
  const handleContinue = () => {
    // Helper function to get the column index from the column key
    const getColumnsIndex = (column: string) => {
      // Extract the column index from the column key
      return column.split("_")[1];
    };

    // Map the selected columns to the headers and body
    const mappedData = {
      // Map the headers to the selected columns
      headers: headers.map((_header, index) => {
        // Get the column index from the column key
        const columnIndex = getColumnsIndex(`column_${index}`);
        // Return the selected column or null if not selected
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      // Map the body to the selected columns
      body: body
        .map((row) => {
          // Transform each row
          const transformedRow = row.map((cell, index) => {
            // Get the column index from the column key
            const columnIndex = getColumnsIndex(`column_${index}`);
            // Return the selected column or null if not selected
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          // Filter out rows that are completely empty
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        // Filter out rows that are completely empty
        .filter((row) => row.length > 0)
    };

    // Convert the mapped data to an array of objects
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        // Get the header from the mapped data
        const header = mappedData.headers[index];
        // If the header is not null, add it to the accumulator
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });

    // Format the data before submitting
    const formatedData = arrayOfData.map((item) => ({
      ...item,
      // Convert the amount to miliunits
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      // Format the date
      date: format(parse(item.date, dateFormat, new Date()), outputFormat)
    }));

    // Call the onSubmit function with the formatted data
    onSubmit(formatedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 z-[100]">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 items-center gap-x-2">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleContinue}
              className="w-full lg:w-auto"
            >
              Continue ({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
