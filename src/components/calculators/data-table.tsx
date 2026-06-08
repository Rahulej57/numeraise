import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCurrency } from "@/context/CurrencyContext";

interface Column {
  header: string;
  accessorKey: string;
  isNumeric?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  maxHeight?: string;
}

export function DataTable({ columns, data, maxHeight = "400px" }: DataTableProps) {
  const { format } = useCurrency();
  
  return (
    <div className="rounded-md border border-border" style={{ maxHeight, overflowY: "auto" }}>
      <Table>
        <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur z-10">
          <TableRow>
            {columns.map((col) => (
               <TableHead key={col.accessorKey} className={col.isNumeric ? "text-right" : ""}>
                 {col.header}
               </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => {
                const val = row[col.accessorKey];
                const displayVal = col.isNumeric && typeof val === 'number' 
                  ? format(val)
                  : val;
                
                return (
                  <TableCell key={col.accessorKey} className={col.isNumeric ? "text-right font-medium" : ""}>
                    {displayVal}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
