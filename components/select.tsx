"use client";
import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

// Define the props for the Select component
type Props = {
  onChange: (value?: string) => void; // Function to handle change in selected value
  onCreate?: (value: string) => void; // Function to handle creation of a new option
  options?: { label: string; value: string }[]; // Array of options for the select component
  value?: string | null | undefined; // Currently selected value
  disabled?: boolean; // Flag to disable the select component
  placeholder?: string; // Placeholder text for the select component
};

// Select component definition
export const Select = ({
  value,
  onChange,
  disabled,
  onCreate,
  options = [],
  placeholder
}: Props) => {
  // Function to handle selection of an option
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value); // Call onChange with the selected value
  };

  // Memoized value to find the currently selected option from the options array
  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreateableSelect
      placeholder={placeholder} // Placeholder text for the select component
      className="text-sm h-10" // Custom class for styling
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2eaf0", // Border color for the control
          ":hover": {
            borderColor: "#e2eaf0" // Border color on hover
          }
        })
      }}
      value={formattedValue} // Currently selected value
      onChange={onSelect} // Handle change in selected value
      options={options} // Array of options for the select component
      onCreateOption={onCreate} // Handle creation of a new option
      isDisabled={disabled} // Disable the select component if the disabled prop is true
    />
  );
};
