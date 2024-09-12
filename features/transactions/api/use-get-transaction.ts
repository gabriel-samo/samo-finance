import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Custom hook to get a specific transaction by ID
export const useGetTransaction = (id?: string) => {
  // Define the query using react-query's useQuery hook
  const query = useQuery({
    // Enable the query only if the id is provided
    enabled: !!id,
    // Unique key for the query to cache and track its state
    queryKey: ["transaction", { id }],
    // Function to fetch the data
    queryFn: async () => {
      // Send the GET request to the server to fetch the transaction by ID
      const response = await client.api.transactions[":id"].$get({
        param: { id }
      });

      // Check if the response status is not OK (status code NOT 2xx)
      if (!response.ok) {
        // Throw an error to be caught by react-query's error handling
        throw new Error("Failed to fetch transaction");
      }

      // Parse the response body as JSON to get the data
      const { data } = await response.json();

      // Return the data to be used by the query
      return data;
    }
  });

  // Return the query object which contains status, data, error, etc.
  return query;
};
