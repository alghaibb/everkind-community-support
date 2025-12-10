import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getDateRanges } from "@/lib/date-utils";
import { cachedJson, CACHE_TIMES } from "@/lib/performance";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as User;

    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get centralized date ranges for consistent queries
    const dateRanges = getDateRanges();

    const result = await prisma.$transaction(async (tx) => {
      const [
        totalApplications,
        weeklyApplications,
        monthlyApplications,
        totalMessages,
        weeklyMessages,
        monthlyMessages,
        totalStaff,
        recentApplications,
        recentMessages,
      ] = await Promise.all([
        // Career application stats
        tx.careerSubmission.count(),
        tx.careerSubmission.count({
          where: {
            createdAt: dateRanges.weekly,
          },
        }),
        tx.careerSubmission.count({
          where: {
            createdAt: dateRanges.monthly,
          },
        }),

        // Contact message stats
        tx.contactMessage.count(),
        tx.contactMessage.count({
          where: {
            createdAt: dateRanges.weekly,
          },
        }),
        tx.contactMessage.count({
          where: {
            createdAt: dateRanges.monthly,
          },
        }),

        // Staff count
        tx.staff.count(),

        // Recent applications
        tx.careerSubmission.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),

        // Recent messages
        tx.contactMessage.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            subject: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

      return {
        totalApplications,
        weeklyApplications,
        monthlyApplications,
        totalMessages,
        weeklyMessages,
        monthlyMessages,
        totalStaff,
        recentApplications,
        recentMessages,
      };
    });

    // Cache admin dashboard for 1 minute
    return cachedJson({
      applications: {
        total: result.totalApplications,
        weekly: result.weeklyApplications,
        monthly: result.monthlyApplications,
      },
      messages: {
        total: result.totalMessages,
        weekly: result.weeklyMessages,
        monthly: result.monthlyMessages,
      },
      staff: {
        total: result.totalStaff,
      },
      recent: {
        applications: result.recentApplications,
        messages: result.recentMessages,
      },
    }, CACHE_TIMES.DYNAMIC);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
