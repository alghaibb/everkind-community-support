import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import ContactMessagesTable from "./_components/ContactMessagesTable";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Messages | Admin",
};

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function MessagesAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Check authentication
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/");
  }

  const userWithRole = session.user as typeof session.user & { role?: string };
  
  if (userWithRole.role !== "ADMIN") {
    redirect("/");
  }

  // Pagination
  const page = parseInt(searchParams.page || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // Build where clause for filtering
  const where = searchParams.search
    ? {
        OR: [
          { firstName: { contains: searchParams.search, mode: "insensitive" as const } },
          { lastName: { contains: searchParams.search, mode: "insensitive" as const } },
          { email: { contains: searchParams.search, mode: "insensitive" as const } },
          { subject: { contains: searchParams.search, mode: "insensitive" as const } },
          { message: { contains: searchParams.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  // Fetch contact messages with pagination
  const [messages, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">
            View and manage all contact form submissions
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Search */}
      <form className="relative max-w-md" action="/admin/messages">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="search"
          placeholder="Search messages..."
          defaultValue={searchParams.search}
          className="pl-10"
        />
      </form>

      {/* Messages Table */}
      <ContactMessagesTable
        messages={messages}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
