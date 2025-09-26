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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.StaffWhereInput = {};

    if (search) {
      where.OR = [
        { phone: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
        { emergencyContact: { contains: search, mode: "insensitive" } },
        { emergencyPhone: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { ahpraRegistration: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "all") {
      where.staffRole = role as any; // Will be validated by Pris
    }

    if (status && status !== "all") {
      where.isActive = status === "active";
    }

    const [staffMembers, totalCount, stats] = await Promise.all([
      // Get paginated staff
      prisma.staff.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),

      // Get total count for pagination
      prisma.staff.count({ where }),

      // Get statistics
      Promise.all([
        prisma.staff.count(),
        prisma.staff.count({ where: { isActive: true } }),
        prisma.staff.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.staff.groupBy({
          by: ["staffRole"],
          _count: { staffRole: true },
        }),
      ]),
    ]);

    const [totalStaff, activeStaff, monthlyHires, roleBreakdown] = stats;

    return NextResponse.json({
      staff: staffMembers,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      stats: {
        total: totalStaff,
        active: activeStaff,
        thisMonth: monthlyHires,
        byRole: roleBreakdown,
      },
    });
  } catch (error) {
    console.error("Staff API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
