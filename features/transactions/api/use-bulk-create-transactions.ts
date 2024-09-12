import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the bulk create API
type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;
// Define the request type for the bulk create API
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

// Define the useBulkCreateTransactions hook
export const useBulkCreateTransactions = () => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for bulk deleting transactions
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the POST request to bulk create transactions
      const response = await client.api.transactions["bulk-create"]["$post"]({
        json
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful transaction deletion
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Transactions created");
      // Invalidate the transactions query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Also invalidate summary
    },
    // Define the onError callback to handle errors during transaction deletion
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to create transactions");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
