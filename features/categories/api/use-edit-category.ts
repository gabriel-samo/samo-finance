import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Define the response type for the category update API
type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
// Define the request type for the category update API
type RequestType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

// Define the useEditCategory hook
// Initialize the query client to manage and invalidate queries
export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  // Define the mutation for updating an existing category
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // Define the mutation function to send the request to the server
    mutationFn: async (json) => {
      // Send the PATCH request to update the category with the specified ID
      const response = await client.api.categories[":id"]["$patch"]({
        param: { id }, // Pass the category ID as a parameter
        json // Pass the updated category data as JSON
      });
      // Return the response data as JSON
      return await response.json();
    },
    // Define the onSuccess callback to handle successful category update
    onSuccess: () => {
      // Show a success toast notification
      toast.success("Category updated successfully");
      // Invalidate the specific category query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      // Invalidate the categories query to refresh the list of categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    // Define the onError callback to handle errors during category update
    onError: (error) => {
      // Show an error toast notification
      toast.error("Failed to update category");
      // Log the error to the console for debugging
      console.error(error);
    }
  });

  // Return the mutation object to be used in components
  return mutation;
};

/*
  Detailed Comments for Future Reference:

  1. ResponseType: This type is inferred from the response of the PATCH request to update an category.
     It ensures that the response data structure is correctly typed.

  2. RequestType: This type is inferred from the request body of the PATCH request to update an category.
     It ensures that the request data structure is correctly typed.

  3. useEditCategory Hook: This custom hook is designed to handle the category update functionality.
     - It takes an optional 'id' parameter which represents the category ID to be updated.
     - It initializes the query client using 'useQueryClient' to manage and invalidate queries.

  4. Mutation Definition:
     - mutationFn: This function sends the PATCH request to update the category with the specified ID.
       It takes 'json' as a parameter which contains the updated category data.
       The response is returned as JSON.
     - onSuccess: This callback is executed when the category update is successful.
       It shows a success toast notification, invalidates the specific category query to refresh the data,
       and invalidates the categories query to refresh the list of categories.
     - onError: This callback is executed when there is an error during the category update.
       It shows an error toast notification and logs the error to the console for debugging.

  5. Return Value: The hook returns the mutation object which can be used in components to trigger the category update.
*/
