"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
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
  // Hook to manage the bulk deletion of transactions
  const deleteTransactions = useBulkDeleteTransactions();
  // Hook to fetch the list of transactions
  const transactionsQuery = useGetTransactions();
  // List of transactions fetched from the server
  const transactions = transactionsQuery.data || [];

  // Boolean to determine if the buttons should be disabled
  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

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
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={() => {}}
        />
      </>
    );
  }

  // Default view: show the list of transactions
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24 z-[100]">
      <Card className="border-none drop-shadow-sm">
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
