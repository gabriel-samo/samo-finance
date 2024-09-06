import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the account creation API
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
// Define the request type for the account creation API
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

// Define the useCreateAccount hook
export const useCreateAccount = () => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for creating a new account
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the POST request to create a new account
      const response = await client.api.accounts.$post({ json });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful account creation
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Account created successfully");
      // Invalidate the accounts query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    // Define the onError callback to handle errors during account creation
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to create account");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};
