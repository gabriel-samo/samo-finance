import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the bulk delete API
type ResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
// Define the request type for the bulk delete API
type RequestType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

// Define the useBulkDeleteCategories hook
export const useBulkDeleteCategories = () => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for bulk deleting categories
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the POST request to bulk delete categories
      const response = await client.api.categories["bulk-delete"]["$post"]({
        json
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful category deletion
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Categories deleted");
      // Invalidate the categories query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // TODO: Also invalidate summary
    },
    // Define the onError callback to handle errors during category deletion
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to delete categories");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
