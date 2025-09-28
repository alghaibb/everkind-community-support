import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as User;

    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.CareerSubmissionWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "all") {
      where.role = role;
    }

    const [applications, totalCount, stats] = await Promise.all([
      // Get paginated applications
      prisma.careerSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          experience: true,
          createdAt: true,
          cert3IndividualSupport: true,
          ahpraRegistration: true,
          workingWithChildrenCheck: true,
          ndisScreeningCheck: true,
          policeCheck: true,
          firstAidCPR: true,
          availability: true,
          resume: true,
          wwccDocument: true,
          ndisDocument: true,
          policeCheckDocument: true,
          firstAidCertificate: true,
          qualificationCertificate: true,
          ahpraCertificate: true,
          status: true,
          rejectedAt: true,
        },
      }),

      // Get total count for pagination
      prisma.careerSubmission.count({ where }),

      // Get statistics
      Promise.all([
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
        prisma.careerSubmission.groupBy({
          by: ["role"],
          _count: { role: true },
        }),
      ]),
    ]);

    const [
      totalApplications,
      weeklyApplications,
      monthlyApplications,
      roleBreakdown,
    ] = stats;

    return NextResponse.json({
      applications,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      stats: {
        total: totalApplications,
        thisWeek: weeklyApplications,
        thisMonth: monthlyApplications,
        byRole: roleBreakdown,
      },
    });
  } catch (error) {
    console.error("Careers API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
