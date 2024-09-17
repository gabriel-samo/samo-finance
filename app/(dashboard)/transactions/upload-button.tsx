import { Upload } from "lucide-react"; // Import the Upload icon from lucide-react
import { useCSVReader } from "react-papaparse"; // Import the useCSVReader hook from react-papaparse

import { Button } from "@/components/ui/button"; // Import the Button component from the UI library

// Define the type for the component props
type Props = {
  onUpload: (results: any) => void; // Function to handle the upload results
};

// UploadButton component to render a button for uploading CSV files
export const UploadButton = ({ onUpload }: Props) => {
  // Destructure the CSVReader component from the useCSVReader hook
  const { CSVReader } = useCSVReader();

  // TODO: add paywall

  return (
    // Render the CSVReader component and pass the onUpload function to handle the accepted upload
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        // Render the Button component with the necessary props from getRootProps
        <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
          <Upload className="size-4 mr-2" /> {/* Render the Upload icon */}
          Import {/* Button text */}
        </Button>
      )}
    </CSVReader>
  );
};
