// Import global CSS styles
import "./globals.css";

// Import necessary types and components from Next.js and other libraries
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

// Import custom components and providers
import { Toaster } from "@/components/ui/sonner";
import { SheetProvider } from "@/providers/sheet-provider";
import { QueryProvider } from "@/providers/query-provider";

// Initialize the Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the application
export const metadata: Metadata = {
  title: "Finance App",
  description: "Finance App for managing your finances made by Gabriel Samoylov"
};

// Specify the runtime environment for the application
export const runtime = "edge";

// Define the root layout component for the application
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Provide Clerk authentication context to the application
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Provide Query context for data fetching */}
          <QueryProvider>
            {/* Provide Sheet context for managing sheets */}
            <SheetProvider />
            {/* Display toast notifications */}
            <Toaster />
            {/* Render child components */}
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
