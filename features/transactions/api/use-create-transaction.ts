import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the transaction creation API
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
// Define the request type for the transaction creation API
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

// Define the useCreateTransaction hook
export const useCreateTransaction = () => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for creating a new transaction
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the POST request to create a new transaction
      const response = await client.api.transactions.$post({ json });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful transaction creation
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Transaction created successfully");
      // Invalidate the transactions query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Define the onError callback to handle errors during transaction creation
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to create transaction");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
