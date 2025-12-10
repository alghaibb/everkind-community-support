import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cachedJson, CACHE_TIMES } from "@/lib/performance";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { userId: session.user.id },
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const now = new Date();
    const startDate = startDateParam ? new Date(startDateParam) : startOfWeek(now, { weekStartsOn: 1 });
    const endDate = endDateParam ? new Date(endDateParam) : endOfWeek(now, { weekStartsOn: 1 });

    // Get shifts for the specified period
    const shifts = await prisma.staffShift.findMany({
      where: {
        staffId: staff.id,
        shiftDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ shiftDate: "asc" }, { startTime: "asc" }],
    });

    // Calculate weekly hours from timesheets
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weekTimesheets = await prisma.timesheetEntry.findMany({
      where: {
        staffId: staff.id,
        workDate: { gte: weekStart, lte: weekEnd },
        status: { in: ["APPROVED", "SUBMITTED"] },
      },
    });
    const weeklyHours = weekTimesheets.reduce((acc, t) => acc + Number(t.totalHours), 0);

    // Calculate monthly hours
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthTimesheets = await prisma.timesheetEntry.findMany({
      where: {
        staffId: staff.id,
        workDate: { gte: monthStart, lte: monthEnd },
        status: { in: ["APPROVED", "SUBMITTED"] },
      },
    });
    const monthlyHours = monthTimesheets.reduce((acc, t) => acc + Number(t.totalHours), 0);

    // Cache schedule for 1 minute
    return cachedJson({
      shifts: shifts.map((shift) => ({
        id: shift.id,
        shiftDate: shift.shiftDate.toISOString(),
        startTime: shift.startTime,
        endTime: shift.endTime,
        duration: shift.duration,
        status: shift.status,
      })),
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      monthlyHours: Math.round(monthlyHours * 10) / 10,
    }, CACHE_TIMES.DYNAMIC);
  } catch (error) {
    console.error("Staff schedule error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}
