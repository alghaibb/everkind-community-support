import { Metadata } from "next";
import { forbidden } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import DashboardStats from "./_components/DashboardStats";
import RecentActivity from "./_components/RecentActivity";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session?.user) {
    return forbidden();
  }

  const userWithRole = session.user as typeof session.user & { role?: string };

  if (userWithRole.role !== "ADMIN") {
    return forbidden();
  }

  // Fetch dashboard statistics
  const [careerCount, messageCount, recentCareers, recentMessages] =
    await Promise.all([
      prisma.careerSubmission.count(),
      prisma.contactMessage.count(),
      prisma.careerSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          subject: true,
          createdAt: true,
        },
      }),
    ]);

  const stats = {
    totalApplications: careerCount,
    totalMessages: messageCount,
    pendingReviews: careerCount,
    activeStaffMembers: 0,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your admin panel.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity
          title="Recent Career Applications"
          items={recentCareers.map((career) => ({
            id: career.id,
            title: `${career.firstName} ${career.lastName}`,
            subtitle: career.role,
            timestamp: career.createdAt,
            href: `/admin/careers/${career.id}`,
          }))}
          viewAllHref="/admin/careers"
        />

        <RecentActivity
          title="Recent Contact Messages"
          items={recentMessages.map((message) => ({
            id: message.id,
            title: `${message.firstName} ${message.lastName}`,
            subtitle: message.subject || "No subject",
            timestamp: message.createdAt,
            href: `/admin/messages/${message.id}`,
          }))}
          viewAllHref="/admin/messages"
        />
      </div>
    </div>
  );
}
