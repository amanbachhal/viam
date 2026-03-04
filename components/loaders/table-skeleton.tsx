import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-8 w-48" />
      </div>

      {/* FILTER BAR SKELETON */}
      <div className="hidden md:block bg-white border rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Using Shadcn Skeleton for inputs and dropdowns */}
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[220px]" />
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[130px]" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      {/* TABLE AREA SKELETON */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          <table className="w-full text-sm text-left">
            <thead className="bg-white border-b sticky top-0 z-20">
              <tr>
                {/* Headers */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <th key={i} className="h-12 px-4">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
                <th className="h-12 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {/* Reuse the row skeletons here so we don't repeat code */}
              <TableRowSkeletons />
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION SKELETON */}
      <div className="border-t pt-4 mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

// Exported separately so we can drop it straight into the <tbody> of your real table
// when the user clicks a filter!
export function TableRowSkeletons({ columns = 8 }: { columns?: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-muted/20">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <Skeleton className={`h-4 ${colIndex === 0 ? "w-32" : "w-20"}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
