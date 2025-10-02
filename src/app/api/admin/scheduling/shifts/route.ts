import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, ShiftStatus } from "@/generated/prisma";

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

    // Get staff shifts with relations
    const shifts = await prisma.staffShift.findMany({
      where,
      include: {
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
      (acc, shift) => {
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

        // Calculate duration in hours
        const [startHour, startMin] = shift.startTime.split(":").map(Number);
        const [endHour, endMin] = shift.endTime.split(":").map(Number);
        const durationHours =
          endHour + endMin / 60 - (startHour + startMin / 60);

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
      {} as Record<string, any>
    );

    const staffShiftsArray = Object.values(staffShifts);

    // Calculate stats
    const stats = {
      totalStaff: staffShiftsArray.length,
      totalShifts: shifts.length,
      scheduledShifts: shifts.filter((s) => s.status === "SCHEDULED").length,
      completedShifts: shifts.filter((s) => s.status === "COMPLETED").length,
      cancelledShifts: shifts.filter((s) => s.status === "CANCELLED").length,
      noShowShifts: shifts.filter((s) => s.status === "NO_SHOW").length,
      totalHours: shifts.reduce((sum, shift) => {
        const [startHour, startMin] = shift.startTime.split(":").map(Number);
        const [endHour, endMin] = shift.endTime.split(":").map(Number);
        const durationHours =
          endHour + endMin / 60 - (startHour + startMin / 60);
        return sum + durationHours;
      }, 0),
    };

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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
