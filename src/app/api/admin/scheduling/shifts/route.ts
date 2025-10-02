import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, ShiftStatus } from "@/generated/prisma";

interface StaffShiftAccumulator {
  id: string;
  staffName: string;
  role: string;
  employeeId: string | null;
  isActive: boolean;
  shifts: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    durationHours: number;
    status: string;
    notes: string | null;
  }>;
  totalHours: number;
}

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
    const week = searchParams.get("week"); // "current", "previous", "next"
    const status = searchParams.get("status");

    // Calculate date range based on week parameter
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)

    let dateFilter: { gte?: Date; lt?: Date } = {};

    if (week === "previous") {
      const previousWeekStart = new Date(startOfWeek);
      previousWeekStart.setDate(startOfWeek.getDate() - 7);
      const previousWeekEnd = new Date(startOfWeek);

      dateFilter = {
        gte: previousWeekStart,
        lt: previousWeekEnd,
      };
    } else if (week === "next") {
      const nextWeekStart = new Date(startOfWeek);
      nextWeekStart.setDate(startOfWeek.getDate() + 7);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

      dateFilter = {
        gte: nextWeekStart,
        lt: nextWeekEnd,
      };
    } else {
      // Current week (default)
      const nextWeekStart = new Date(startOfWeek);
      nextWeekStart.setDate(startOfWeek.getDate() + 7);

      dateFilter = {
        gte: startOfWeek,
        lt: nextWeekStart,
      };
    }

    // Build where clause
    const where: Prisma.StaffShiftWhereInput = {
      shiftDate: dateFilter,
    };

    if (search) {
      where.staff = {
        OR: [
          {
            user: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
          { employeeId: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (status && status !== "all") {
      where.status = status as ShiftStatus;
    }

    // Calculate stats using database aggregations (more efficient)
    const statsPromises = [
      // Count by status
      prisma.staffShift.groupBy({
        by: ["status"],
        where,
        _count: { id: true },
      }),
      // Count unique staff members
      prisma.staffShift.findMany({
        where,
        select: {
          staffId: true,
        },
        distinct: ["staffId"],
      }),
      // Get total shifts count
      prisma.staffShift.count({ where }),
    ];

    const [statusCountsResult, uniqueStaffResult, totalShiftsResult] = await Promise.all(statsPromises);

    // Type-safe extraction of results
    const statusCounts = statusCountsResult as Array<{ status: ShiftStatus; _count: { id: number } }>;
    const uniqueStaff = uniqueStaffResult as Array<{ staffId: string }>;
    const totalShifts = totalShiftsResult as number;
    const uniqueStaffCount = uniqueStaff.length;

    // Calculate total hours using stored duration field (in minutes, convert to hours)
    const totalDurationResult = await prisma.staffShift.aggregate({
      where,
      _sum: { duration: true },
    });

    const totalHours = (totalDurationResult._sum.duration || 0) / 60; // Convert minutes to hours

    // Build stats object
    const stats = {
      totalStaff: uniqueStaffCount,
      totalShifts,
      scheduledShifts: statusCounts.find(s => s.status === "SCHEDULED")?._count.id || 0,
      completedShifts: statusCounts.find(s => s.status === "COMPLETED")?._count.id || 0,
      cancelledShifts: statusCounts.find(s => s.status === "CANCELLED")?._count.id || 0,
      noShowShifts: statusCounts.find(s => s.status === "NO_SHOW")?._count.id || 0,
      totalHours,
    };

    // Get staff shifts with optimized select
    const shifts = await prisma.staffShift.findMany({
      where,
      select: {
        id: true,
        shiftDate: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        notes: true,
        staff: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            staffRole: true,
            employeeId: true,
            isActive: true,
          },
        },
      },
      orderBy: [{ shiftDate: "asc" }, { startTime: "asc" }],
    });

    // Group shifts by staff member for easier display
    const staffShifts = shifts.reduce(
      (acc: Record<string, StaffShiftAccumulator>, shift) => {
        const staffId = shift.staff.id;

        if (!acc[staffId]) {
          acc[staffId] = {
            id: shift.staff.id,
            staffName: shift.staff.user.name,
            role: shift.staff.staffRole,
            employeeId: shift.staff.employeeId,
            isActive: shift.staff.isActive,
            shifts: [],
            totalHours: 0,
          };
        }

        // Use stored duration (in minutes) and convert to hours for display
        const durationHours = shift.duration / 60;

        acc[staffId].shifts.push({
          id: shift.id,
          date: shift.shiftDate.toISOString().split("T")[0],
          startTime: shift.startTime,
          endTime: shift.endTime,
          duration: shift.duration,
          durationHours,
          status: shift.status,
          notes: shift.notes,
        });

        acc[staffId].totalHours += durationHours;

        return acc;
      },
      {} as Record<string, StaffShiftAccumulator>
    );

    const staffShiftsArray = Object.values(staffShifts);

    return NextResponse.json({
      staffShifts: staffShiftsArray,
      stats,
      week: {
        start: dateFilter.gte?.toISOString().split("T")[0],
        end: dateFilter.lt?.toISOString().split("T")[0],
        type: week || "current",
      },
    });
  } catch (error) {
    console.error("Staff shifts API error:", error);

    // Check for specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes("connection") || error.message.includes("pool")) {
        console.error("Database connection error detected:", error.message);
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 }
        );
      }

      if (error.message.includes("timeout")) {
        console.error("Database timeout error:", error.message);
        return NextResponse.json(
          { error: "Database timeout. Please try again." },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
