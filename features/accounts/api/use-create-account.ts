import { toast } from "sonner";
import type { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// define the response type
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
// define the request type
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

// define the useCreateAccount hook
export const useCreateAccount = () => {
  // define the query client
  const queryClient = useQueryClient();

  // define the mutation
  const mutation = useMutation<ResponseType, Error, RequestType>({
    // define the mutation function
    mutationFn: async (json) => {
      // send the request to the server
      const response = await client.api.accounts.$post({ json });
      // return the response
      return await response.json();
    },
    // define the onSuccess callback
    onSuccess: () => {
      // show the success toast
      toast.success("Account created successfully");
      // invalidate the accounts query
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    // define the onError callback
    onError: (error) => {
      // show the error toast
      toast.error("Failed to create account");
      // log the error
      console.error(error);
    }
  });

  // return the mutation
  return mutation;
};
