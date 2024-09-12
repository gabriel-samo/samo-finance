import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";

// Custom hook to get all transactions
export const useGetTransactions = () => {
  // Get the search parameters from the URL
  const params = useSearchParams();
  // Extract the 'from' parameter or set it to an empty string if not present
  const from = params.get("from") || "";
  // Extract the 'to' parameter or set it to an empty string if not present
  const to = params.get("to") || "";
  // Extract the 'accountId' parameter or set it to an empty string if not present
  const accountId = params.get("accountId") || "";

  // Define the query using react-query's useQuery hook
  const query = useQuery({
    // Unique key for the query to cache and track its state
    // The key includes the 'from', 'to', and 'accountId' parameters to ensure the cache is specific to these parameters
    // TODO: check if params are needed in the key
    queryKey: ["transactions", { from, to, accountId }],
    // Function to fetch the data
    queryFn: async () => {
      // Send the GET request to the server to fetch transactions
      // The request includes the 'from', 'to', and 'accountId' parameters as query parameters
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId
        }
      });

      // Check if the response status is not OK (status code 2xx)
      if (!response.ok) {
        // Throw an error to be caught by react-query's error handling
        // This will trigger the error state in the query result
        throw new Error("Failed to fetch transactions");
      }

      // Parse the response body as JSON to get the data
      // The response is expected to have a 'data' field containing the transactions
      const { data } = await response.json();

      // Return the data to be used by the query
      // This data will be available in the query result under the 'data' field
      return data;
    }
  });

  // Return the query object which contains status, data, error, etc.
  // The query object can be used in the component to display the transactions or handle loading and error states
  return query;
};
