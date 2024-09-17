import { toast } from "sonner";
import type { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the account delete API
type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

// Define the useDeleteAccount hook
export const useDeleteAccount = (id?: string) => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for deleting an existing account
  const mutation = useMutation<ResponseType, Error>({
    // Define the mutation function to send the request to the server
    mutationFn: async () => {
      // Send the DELETE request to delete the account with the specified ID
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id } // Pass the account ID as a parameter
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful account deletion
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Account deleted successfully");
      // Invalidate the specific account query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      // Invalidate the accounts query to refresh the list of accounts
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Define the onError callback to handle errors during account deletion
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to delete account");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
