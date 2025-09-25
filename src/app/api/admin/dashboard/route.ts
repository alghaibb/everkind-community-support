import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    // Get dashboard statistics
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
      prisma.careerSubmission.count(),
      prisma.careerSubmission.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.careerSubmission.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Contact message stats
      prisma.contactMessage.count(),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.contactMessage.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Staff count
      prisma.staff.count(),

      // Recent applications
      prisma.careerSubmission.findMany({
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
      prisma.contactMessage.findMany({
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

    return NextResponse.json({
      applications: {
        total: totalApplications,
        weekly: weeklyApplications,
        monthly: monthlyApplications,
      },
      messages: {
        total: totalMessages,
        weekly: weeklyMessages,
        monthly: monthlyMessages,
      },
      staff: {
        total: totalStaff,
      },
      recent: {
        applications: recentApplications,
        messages: recentMessages,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
