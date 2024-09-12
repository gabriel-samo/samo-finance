import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

// Define the props for the AmountInput component
type Props = {
  value: string; // The current value of the input field
  onChange: (value: string | undefined) => void; // Function to handle changes to the input field
  placeholder?: string; // Optional placeholder text for the input field
  disabled?: boolean; // Optional flag to disable the input field
};

// Define the AmountInput component
export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled
}: Props) => {
  // Parse the value to a float, defaulting to 0 if the value is undefined
  const parsedValue = parseFloat(value ?? "0");
  // Determine if the value represents income (positive) or expense (negative)
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  // Function to reverse the value (i.e., change income to expense and vice versa)
  const onReverseValue = () => {
    if (!value) return; // If there is no value, do nothing
    const newValue = (parseFloat(value) * -1).toString(); // Reverse the value
    onChange(newValue.toString()); // Call the onChange function with the new value
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                isIncome && "bg-emerald-500 hover:bg-emerald-600", // Green background for income
                isExpense && "bg-rose-500 hover:bg-rose-600" // Red background for expense
              )}
            >
              {/* Info icon if value is 0 */}
              {!parsedValue && <Info className="size-3 text-white" />}
              {/* Plus icon for income */}
              {isIncome && <PlusCircle className="size-3 text-white" />}
              {/* Minus icon for expense */}
              {isExpense && <MinusCircle className="size-3 text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {/* Tooltip content explaining the icons */}
            Use [+] for income and [-] for expenses
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix="$" // Prefix for the currency input
        className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder} // Placeholder text
        value={value} // Current value of the input
        decimalsLimit={2} // Limit to 2 decimal places
        decimalScale={2} // Scale to 2 decimal places
        onValueChange={(value) => onChange(value)} // Handle value changes
        disabled={disabled} // Disable the input if the disabled prop is true
      />
      <p className="text-xs text-muted-foreground mt-2">
        {/* Message indicating the value is income */}
        {isIncome && "This will count as income"}
        {/* Message indicating the value is expense */}
        {isExpense && "This will count as expense"}
      </p>
    </div>
  );
};
