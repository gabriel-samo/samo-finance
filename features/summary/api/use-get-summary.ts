import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
  // Get the search parameters from the URL
  const params = useSearchParams();
  // Extract the 'from' date parameter or set it to an empty string if not provided
  const from = params.get("from") || "";
  // Extract the 'to' date parameter or set it to an empty string if not provided
  const to = params.get("to") || "";
  // Extract the 'accountId' parameter or set it to an empty string if not provided
  const accountId = params.get("accountId") || "";

  // Use the useQuery hook from react-query to fetch the summary data
  const query = useQuery({
    // TODO: check if params are needed in the key
    // Set the query key to include the summary and the parameters
    // This helps in caching and refetching the data when the parameters change
    queryKey: ["summary", { from, to, accountId }],

    // Define the query function to fetch the summary data
    queryFn: async () => {
      // Make a GET request to the summary API endpoint with the query parameters
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId
        }
      });

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      // Parse the JSON response to get the data
      const { data } = await response.json();

      // Convert the amounts from miliunits to the standard units and return the transformed data
      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliunits(category.value)
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses)
        }))
      };
    }
  });

  // Return the query object which contains the status and data of the query
  return query;
};
