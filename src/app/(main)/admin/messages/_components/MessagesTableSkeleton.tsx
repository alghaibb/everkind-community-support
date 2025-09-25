import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function MessagesTableSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">Loading messages data...</p>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>

      {/* Search - Static structure */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search messages..."
          className="w-full sm:w-80"
          disabled
        />
      </div>

      {/* Table - Static headers, skeleton data rows */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-64" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Only skeleton the data */}
        <div className="block md:hidden space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="mx-4">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination - Static structure, skeleton the numbers */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 border-t">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Skeleton className="h-9 w-8" />
            <Skeleton className="h-9 w-8" />
            <Button variant="outline" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
