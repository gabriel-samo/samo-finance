import { toast } from "sonner";
import type { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the category delete API
type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

// Define the useDeleteCategory hook
export const useDeleteCategory = (id?: string) => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for deleting an existing category
  const mutation = useMutation<ResponseType, Error>({
    // Define the mutation function to send the request to the server
    mutationFn: async () => {
      // Send the DELETE request to delete the category with the specified ID
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id } // Pass the category ID as a parameter
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful category deletion
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Category deleted successfully");
      // Invalidate the specific category query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      // Invalidate the categories query to refresh the list of categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Invalidate summary
    },
    // Define the onError callback to handle errors during category deletion
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to delete category");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
