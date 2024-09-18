"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { transactions as transactionsSchema } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
import { UploadButton } from "./upload-button";

// Enum to manage the different states of the page
enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
}

// Initial state for import results
const INITIAL_IMPORT_RESULTS = {
  data: [],
  error: [],
  meta: {}
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  // State to manage the current variant of the page (either LIST or IMPORT)
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  // State to manage the results of an import operation
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  // Function to handle the upload of new transactions
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results);
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  // Function to cancel the import operation and reset the state
  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  // Hook to manage the creation of a new transaction
  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  // Hook to manage the bulk deletion of transactions
  const deleteTransactions = useBulkDeleteTransactions();
  // Hook to fetch the list of transactions
  const transactionsQuery = useGetTransactions();
  // List of transactions fetched from the server
  const transactions = transactionsQuery.data || [];

  // Boolean to determine if the buttons should be disabled
  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  // Function to handle the submission of imported transactions
  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    // Prompt the user to select an account
    const accountId = await confirm();

    // If no account is selected, show an error message and return
    if (!accountId) return toast.error("Please select an account to continue.");

    // Map the imported values to include the selected account ID
    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string
    }));

    // Use the createTransactions hook to submit the data
    createTransactions.mutate(data, {
      onSuccess: () => {
        // On success, reset the import state and switch back to the LIST variant
        onCancelImport();
      }
    });
  };

  // If the transactions are still loading, show a loading skeleton
  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 z-[100]">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If the current variant is IMPORT, show the import card
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  // Default view: show the list of transactions
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 z-[100]">
      <Card className="border-none drop-shadow-md">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions Page
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 items-center gap-x-2">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add New
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
