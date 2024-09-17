import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the account update API
type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
// Define the request type for the account update API
type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

// Define the useEditAccount hook
export const useEditAccount = (id?: string) => {
  // Initialize the query client to manage and invalidate queries
  const queryClient = useQueryClient();

  // Define the mutation for updating an existing account
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the PATCH request to update the account with the specified ID
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id }, // Pass the account ID as a parameter
        json // Pass the updated account data as JSON
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful account update
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Account updated successfully");
      // Invalidate the specific account query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      // Invalidate the accounts query to refresh the list of accounts
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Define the onError callback to handle errors during account update
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to update account");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};

/*
  Detailed Comments for Future Reference:

  1. ResponseType: This type is inferred from the response of the PATCH request to update an account.
     It ensures that the response data structure is correctly typed.

  2. RequestType: This type is inferred from the request body of the PATCH request to update an account.
     It ensures that the request data structure is correctly typed.

  3. useEditAccount Hook: This custom hook is designed to handle the account update functionality.
     - It takes an optional 'id' parameter which represents the account ID to be updated.
     - It initializes the query client using 'useQueryClient' to manage and invalidate queries.

  4. Mutation Definition:
     - mutationFn: This function sends the PATCH request to update the account with the specified ID.
       It takes 'json' as a parameter which contains the updated account data.
       The response is returned as JSON.
     - onSuccess: This callback is executed when the account update is successful.
       It shows a success toast notification, invalidates the specific account query to refresh the data,
       and invalidates the accounts query to refresh the list of accounts.
     - onError: This callback is executed when there is an error during the account update.
       It shows an error toast notification and logs the error to the console for debugging.

  5. Return Value: The hook returns the mutation object which can be used in components to trigger the account update.
*/
