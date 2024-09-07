import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Custom hook to get all accounts
export const useGetAccounts = () => {
  // Define the query using react-query's useQuery hook
  const query = useQuery({
    // Unique key for the query to cache and track its state
    queryKey: ["accounts"],
    // Function to fetch the data
    queryFn: async () => {
      // Send the GET request to the server to fetch accounts
      const response = await client.api.accounts.$get();

      // Check if the response status is not OK (status code 2xx)
      if (!response.ok) {
        // Throw an error to be caught by react-query's error handling
        throw new Error("Failed to fetch accounts");
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
