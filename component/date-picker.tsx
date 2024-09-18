import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/component/ui/button";
import { Calendar } from "@/component/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/component/ui/popover";

// Define the props for the DatePicker component
type Props = {
  value?: Date; // Optional date value for the selected date
  onChange?: SelectSingleEventHandler; // Optional event handler for date selection
  disabled?: boolean; // Optional flag to disable the date picker
};

// DatePicker component definition
export const DatePicker = ({ value, onChange, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

/*
  Detailed Comments for Future Reference:

  1. Props: This type defines the props for the DatePicker component.
     - value: An optional Date object representing the selected date.
     - onChange: An optional event handler function that is called when a date is selected.
     - disabled: An optional boolean flag to disable the date picker.

  2. DatePicker Component: This component is designed to provide a date selection functionality using a popover and calendar.
     - It uses the Popover component to display the calendar in a popover when the button is clicked.
     - The PopoverTrigger component is used to trigger the popover when the button is clicked.
     - The Button component is used to display the selected date or a placeholder text if no date is selected.
     - The CalendarIcon component is used to display a calendar icon inside the button.
     - The format function from date-fns is used to format the selected date in a human-readable format (PPP).
     - The PopoverContent component is used to render the calendar inside the popover.
     - The Calendar component is used to display the calendar with the following props:
       - mode: Set to "single" to allow single date selection.
       - selected: The selected date value.
       - onSelect: The event handler function to handle date selection.
       - disabled: The flag to disable the calendar if the disabled prop is true.
       - initialFocus: Set to true to focus the calendar when the popover is opened.

  3. Popover: This component is used to create a popover that contains the calendar. It wraps the button and the calendar.
     - PopoverTrigger: This component is used to trigger the popover. It wraps the button that, when clicked, opens the popover.
     - PopoverContent: This component is used to render the content of the popover, which in this case is the calendar.

  4. Button: This component is used to display the selected date or a placeholder text if no date is selected. It also contains the CalendarIcon.
     - The button is disabled if the disabled prop is true.
     - The className is dynamically set using the cn function to apply different styles based on whether a date is selected or not.

  5. CalendarIcon: This component is used to display a calendar icon inside the button. It is always displayed to the left of the text.

  6. format: This function from date-fns is used to format the selected date in a human-readable format (PPP). If no date is selected, it displays "Pick a date".

  7. Calendar: This component is used to display the calendar inside the popover. It has several props:
     - mode: Set to "single" to allow single date selection.
     - selected: The selected date value.
     - onSelect: The event handler function to handle date selection.
     - disabled: The flag to disable the calendar if the disabled prop is true.
     - initialFocus: Set to true to focus the calendar when the popover is opened.
*/
