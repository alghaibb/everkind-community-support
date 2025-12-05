import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

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
    const status = searchParams.get("status");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Build where clause
    const whereClause: Record<string, unknown> = { staffId: staff.id };

    if (status) {
      whereClause.status = status;
    }

    if (startDateParam || endDateParam) {
      whereClause.workDate = {};
      if (startDateParam) {
        (whereClause.workDate as Record<string, unknown>).gte = new Date(startDateParam);
      }
      if (endDateParam) {
        (whereClause.workDate as Record<string, unknown>).lte = new Date(endDateParam);
      }
    }

    // Get timesheet entries
    const entries = await prisma.timesheetEntry.findMany({
      where: whereClause,
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { workDate: "desc" },
    });

    // Calculate stats
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const allEntries = await prisma.timesheetEntry.findMany({
      where: { staffId: staff.id },
    });

    const weeklyHours = allEntries
      .filter((e) => e.workDate >= weekStart && e.workDate <= weekEnd)
      .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
      .reduce((acc, e) => acc + Number(e.totalHours), 0);

    const monthlyHours = allEntries
      .filter((e) => e.workDate >= monthStart && e.workDate <= monthEnd)
      .filter((e) => e.status === "APPROVED" || e.status === "SUBMITTED")
      .reduce((acc, e) => acc + Number(e.totalHours), 0);

    const pendingCount = allEntries.filter((e) => e.status === "SUBMITTED").length;
    const approvedCount = allEntries.filter((e) => e.status === "APPROVED").length;

    return NextResponse.json({
      entries: entries.map((e) => ({
        id: e.id,
        workDate: e.workDate.toISOString(),
        startTime: e.startTime,
        endTime: e.endTime,
        breakMinutes: e.breakMinutes,
        totalHours: Number(e.totalHours),
        serviceType: e.serviceType,
        location: e.location,
        description: e.description,
        status: e.status,
        submittedAt: e.submittedAt?.toISOString(),
        approvedAt: e.approvedAt?.toISOString(),
        rejectedAt: e.rejectedAt?.toISOString(),
        rejectionNotes: e.rejectionNotes,
        participant: e.participant,
      })),
      total: entries.length,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      monthlyHours: Math.round(monthlyHours * 10) / 10,
      pendingCount,
      approvedCount,
    });
  } catch (error) {
    console.error("Staff timesheets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      workDate,
      startTime,
      endTime,
      breakMinutes = 0,
      serviceType,
      location,
      description,
      participantId,
      submit = false,
    } = body;

    // Calculate total hours
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin) - breakMinutes;
    const totalHours = totalMinutes / 60;

    if (totalHours <= 0) {
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
    }

    const entry = await prisma.timesheetEntry.create({
      data: {
        staffId: staff.id,
        workDate: new Date(workDate),
        startTime,
        endTime,
        breakMinutes,
        totalHours,
        serviceType,
        location,
        description,
        participantId,
        status: submit ? "SUBMITTED" : "DRAFT",
        submittedAt: submit ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        status: entry.status,
        totalHours: Number(entry.totalHours),
      },
    });
  } catch (error) {
    console.error("Create timesheet error:", error);
    return NextResponse.json(
      { error: "Failed to create timesheet entry" },
      { status: 500 }
    );
  }
}
