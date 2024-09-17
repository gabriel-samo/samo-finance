import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the bulk delete API
type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
// Define the request type for the bulk delete API
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

// Define the useBulkDeleteAccounts hook
export const useBulkDeleteAccounts = () => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for bulk deleting accounts
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the POST request to bulk delete accounts
      const response = await client.api.accounts["bulk-delete"]["$post"]({
        json
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful account deletion
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Accounts deleted");
      // Invalidate the accounts query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Define the onError callback to handle errors during account deletion
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to delete accounts");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
