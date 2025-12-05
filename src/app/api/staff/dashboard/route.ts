import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get staff profile
    const staff = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      include: {
        user: { select: { name: true, email: true } },
        assignedParticipants: { where: { endDate: null } },
      },
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff profile not found" }, { status: 404 });
    }

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    // Get today's shifts
    const todayShifts = await prisma.staffShift.findMany({
      where: {
        staffId: staff.id,
        shiftDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { startTime: "asc" },
    });

    // Get week's total hours from timesheets
    const weekTimesheets = await prisma.timesheetEntry.findMany({
      where: {
        staffId: staff.id,
        workDate: {
          gte: weekStart,
          lte: weekEnd,
        },
        status: { in: ["APPROVED", "SUBMITTED"] },
      },
    });

    const weekHours = weekTimesheets.reduce(
      (acc, t) => acc + Number(t.totalHours),
      0
    );

    // Get pending timesheets count
    const pendingTimesheetsCount = await prisma.timesheetEntry.count({
      where: {
        staffId: staff.id,
        status: "SUBMITTED",
      },
    });

    // Get pending shift requests
    const pendingRequests = await prisma.shiftRequest.findMany({
      where: {
        staffId: staff.id,
        status: "PENDING",
      },
      include: {
        availableShift: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get pending timesheets
    const pendingTimesheets = await prisma.timesheetEntry.findMany({
      where: {
        staffId: staff.id,
        status: "SUBMITTED",
      },
      orderBy: { workDate: "desc" },
      take: 5,
    });

    // Get unread notifications
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      staffName: staff.user.name,
      staffRole: staff.staffRole,
      stats: {
        todayShifts: todayShifts.length,
        weekHours: Math.round(weekHours * 10) / 10,
        assignedParticipants: staff.assignedParticipants.length,
        pendingTimesheets: pendingTimesheetsCount,
      },
      todayShifts: todayShifts.map((shift) => ({
        id: shift.id,
        startTime: shift.startTime,
        endTime: shift.endTime,
        serviceType: "Support Service", // You can add this field to the shift model
        location: "TBD", // You can add this field to the shift model
        status: shift.status,
      })),
      pendingRequests: pendingRequests.map((req) => ({
        id: req.id,
        shiftDate: req.availableShift.shiftDate.toISOString(),
        startTime: req.availableShift.startTime,
        endTime: req.availableShift.endTime,
      })),
      pendingTimesheets: pendingTimesheets.map((t) => ({
        id: t.id,
        workDate: t.workDate.toISOString(),
        totalHours: Number(t.totalHours),
        status: t.status,
      })),
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Staff dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
