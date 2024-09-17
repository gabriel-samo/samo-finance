import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { subDays, parse, differenceInDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { clerkOptions } from "@/utils/clerkOpions";
import { accounts, transactions, categories } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

// Initialize a new Hono app and define a GET method for the root path
const app = new Hono().get(
  "/",
  // Middleware for authentication using Clerk
  clerkMiddleware(clerkOptions),
  // Middleware for validating the request query parameters using Zod
  zValidator(
    "query",
    z.object({
      from: z.string().optional(), // Optional 'from' date parameter
      to: z.string().optional(), // Optional 'to' date parameter
      accountId: z.string().optional() // Optional 'accountId' parameter
    })
  ),
  // Handler function for the GET request
  async (c) => {
    // Get the authentication object from the context
    const auth = getAuth(c);
    // Get the validated query parameters from the request
    const { from, to, accountId } = c.req.valid("query");

    // If the user is not authenticated, return a 401 Unauthorized response
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Set default 'to' date to the current date
    const defaultTo = new Date();
    // Set default 'from' date to 30 days before the current date
    const defualtFrom = subDays(defaultTo, 30);

    // Parse the 'from' date if provided, otherwise use the default 'from' date
    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defualtFrom;

    // Parse the 'to' date if provided, otherwise use the default 'to' date
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    // Calculate the length of the current period in days
    const periodLength = differenceInDays(endDate, startDate) + 1;
    // Calculate the start date of the last period
    const lastPeriodStart = subDays(startDate, periodLength);
    // Calculate the end date of the last period
    const lastPeriodEnd = subDays(endDate, periodLength);

    // Function to fetch financial data for a given user and date range
    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date
    ) {
      return await db
        .select({
          income:
            sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ), // Calculate total income
          expenses:
            sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
              Number
            ), // Calculate total expenses
          remaining: sum(transactions.amount).mapWith(Number) // Calculate remaining amount
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined, // Filter by accountId if provided
            eq(accounts.userId, userId), // Filter by userId
            gte(transactions.date, startDate), // Filter by startDate
            lte(transactions.date, endDate) // Filter by endDate
          )
        );
    }

    // Fetch financial data for the current period
    const [currentPeriod] = await fetchFinancialData(
      auth.userId,
      startDate,
      endDate
    );
    // Fetch financial data for the last period
    const [lastPeriod] = await fetchFinancialData(
      auth.userId,
      lastPeriodStart,
      lastPeriodEnd
    );

    // Calculate the percentage change in income between the current and last periods
    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );

    // Calculate the percentage change in expenses between the current and last periods
    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );

    // Calculate the percentage change in remaining amount between the current and last periods
    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    // Query the database to get the top spending categories for the current period
    const catgory = await db
      .select({
        name: categories.name, // Select the category name
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number) // Calculate the total spending for each category
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined, // Filter by accountId if provided
          eq(accounts.userId, auth.userId), // Filter by userId
          lt(transactions.amount, 0), // Only include expenses (negative amounts)
          gte(transactions.date, startDate), // Filter by startDate
          lte(transactions.date, endDate) // Filter by endDate
        )
      )
      .groupBy(categories.name) // Group by category name
      .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`)); // Order by total spending in descending order

    // Get the top 3 categories
    const topCategories = catgory.slice(0, 3);
    // Get the remaining categories
    const otherCategories = catgory.slice(3);
    // Calculate the total spending for the remaining categories
    const otherSum = otherCategories.reduce(
      (sum, current) => sum + current.value,
      0
    );

    // Combine the top categories with the remaining categories as "Other"
    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherSum
      });
    }

    // Query the database to get the daily income and expenses for the current period
    const activeDays = await db
      .select({
        date: transactions.date, // Select the transaction date
        income:
          sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
            Number
          ), // Calculate total daily income
        expenses:
          sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(
            Number
          ) // Calculate total daily expenses
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined, // Filter by accountId if provided
          eq(accounts.userId, auth.userId), // Filter by userId
          gte(transactions.date, startDate), // Filter by startDate
          lte(transactions.date, endDate) // Filter by endDate
        )
      )
      .groupBy(transactions.date) // Group by transaction date
      .orderBy(transactions.date); // Order by transaction date

    // Fill in any missing days in the activeDays array
    const days = fillMissingDays(activeDays, startDate, endDate);

    // Return the financial summary data as a JSON response
    return c.json({
      data: {
        remainingAmount: currentPeriod.remaining, // Remaining amount for the current period
        remainingChange, // Percentage change in remaining amount
        incomeAmount: currentPeriod.income, // Total income for the current period
        incomeChange, // Percentage change in income
        expensesAmount: currentPeriod.expenses, // Total expenses for the current period
        expensesChange, // Percentage change in expenses
        categories: finalCategories, // Top spending categories
        days // Daily income and expenses
      }
    });
  }
);

export default app;
