import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/component/ui/table";
import { TableHeadSelect } from "./table-head-select";

type Props = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableSelectChange: (columnIndex: number, value: string | null) => void;
};

// ImportTable component to render the table for importing transactions
export const ImportTable = ({
  headers,
  body,
  selectedColumns,
  onTableSelectChange
}: Props) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((_item, index) => (
              <TableHead key={index}>
                {/* Render the TableHeadSelect component for each header */}
                <TableHeadSelect
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  onChange={onTableSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row: string[], index: number) => (
            <TableRow key={index}>
              {row.map((cell: string, index: number) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      ;
    </div>
  );
};
