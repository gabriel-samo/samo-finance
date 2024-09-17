import { toast } from "sonner";
import type { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the transaction delete API
type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

// Define the useDeleteTransaction hook
export const useDeleteTransaction = (id?: string) => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for deleting an existing transaction
  const mutation = useMutation<ResponseType, Error>({
    // Define the mutation function to send the request to the server
    mutationFn: async () => {
      // Send the DELETE request to delete the transaction with the specified ID
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id } // Pass the transaction ID as a parameter
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful transaction deletion
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Transaction deleted successfully");
      // Invalidate the specific transaction query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      // Invalidate the transactions query to refresh the list of transactions
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Define the onError callback to handle errors during transaction deletion
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to delete transaction");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
