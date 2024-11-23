import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function UserListSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell className="font-mono text-xs font-medium">
              <Skeleton className="h-4 w-[172px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[92px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[92px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[92px]" />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
