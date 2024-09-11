import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the category creation API
type ResponseType = InferResponseType<typeof client.api.categories.$post>;
// Define the request type for the category creation API
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

// Define the useCreateCategory hook
export const useCreateCategory = () => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for creating a new category
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the POST request to create a new category
      const response = await client.api.categories.$post({ json });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful category creation
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Category created successfully");
      // Invalidate the categories query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    // Define the onError callback to handle errors during category creation
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to create category");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
