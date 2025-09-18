import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CareerSubmissionsTable from "./_components/CareerSubmissionsTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Career Applications | Admin",
};

interface SearchParams {
  search?: string;
  role?: string;
  page?: string;
}

export default async function CareersAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(searchParams.search && {
      OR: [
        {
          firstName: {
            contains: searchParams.search,
            mode: "insensitive" as const,
          },
        },
        {
          lastName: {
            contains: searchParams.search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: searchParams.search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
    ...(searchParams.role && { role: searchParams.role }),
  };

  const [submissions, totalCount] = await Promise.all([
    prisma.careerSubmission.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.careerSubmission.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Career Applications
          </h1>
          <p className="text-muted-foreground">
            Manage and review all career applications
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <form className="relative flex-1" action="/admin/careers">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Search by name or email..."
            defaultValue={searchParams.search}
            className="pl-10"
          />
        </form>
        <select
          name="role"
          className="rounded-md border px-4 py-2 text-sm"
          defaultValue={searchParams.role}
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value) {
              url.searchParams.set("role", e.target.value);
            } else {
              url.searchParams.delete("role");
            }
            window.location.href = url.toString();
          }}
        >
          <option value="">All Roles</option>
          <option value="Support Worker">Support Worker</option>
          <option value="Registered Nurse">Registered Nurse</option>
          <option value="Enrolled Nurse">Enrolled Nurse</option>
        </select>
      </div>

      <CareerSubmissionsTable
        submissions={submissions}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
