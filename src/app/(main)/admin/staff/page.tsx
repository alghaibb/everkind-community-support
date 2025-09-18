import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import StaffTable from "./_components/StaffTable";
import CreateStaffDialog from "./_components/CreateStaffDialog";

export const metadata: Metadata = {
  title: "Staff Management | Admin",
  description: "Manage staff accounts for EverKind Community Support",
};

export default async function StaffManagementPage({
  searchParams,
}: {
  searchParams: { search?: string; role?: string; page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      searchParams.search
        ? {
            OR: [
              {
                name: {
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
          }
        : {},
      searchParams.role ? { role: searchParams.role as "STAFF" | "ADMIN" } : {},
    ],
  };

  const [staffMembers, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  const stats = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  const adminCount = stats.find((s) => s.role === "ADMIN")?._count || 0;
  const staffCount = stats.find((s) => s.role === "STAFF")?._count || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage staff accounts for your organization
          </p>
        </div>
        <CreateStaffDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              All registered users in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Badge variant="destructive">ADMIN</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">
              Users with full system access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Badge>STAFF</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffCount}</div>
            <p className="text-xs text-muted-foreground">
              Regular staff accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffTable
            staffMembers={staffMembers}
            currentPage={page}
            totalPages={totalPages}
            searchParams={searchParams}
          />
        </CardContent>
      </Card>
    </div>
  );
}
