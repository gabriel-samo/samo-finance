import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

// Get all accounts
export const useGetAccounts = () => {
  // Define the query
  const query = useQuery({
    // Define the query key
    queryKey: ["accounts"],
    // Define the query function
    queryFn: async () => {
      // Send the request to the server
      const response = await client.api.accounts.$get();

      // Check if the response is ok
      if (!response.ok) {
        // Throw an error if the response is not ok
        throw new Error("Failed to fetch accounts");
      }

      // Parse the response as JSON
      const { data } = await response.json();

      // Return the data
      return data;
    }
  });

  // Return the query
  return query;
};
