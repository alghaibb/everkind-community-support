import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { addDays, startOfDay } from "date-fns";

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
    const serviceType = searchParams.get("serviceType");
    const dateParam = searchParams.get("date");

    const today = startOfDay(new Date());
    const futureDate = addDays(today, 30); // Look 30 days ahead

    // Build where clause
    const whereClause: Record<string, unknown> = {
      isAssigned: false,
      shiftDate: {
        gte: dateParam ? new Date(dateParam) : today,
        lte: futureDate,
      },
    };

    // Filter by service type if provided
    if (serviceType) {
      whereClause.serviceType = serviceType;
    }

    // Filter by staff role if required
    const orConditions = [
      { requiredRole: null },
      { requiredRole: staff.staffRole },
    ];

    // Get available shifts
    const shifts = await prisma.availableShift.findMany({
      where: {
        ...whereClause,
        OR: orConditions,
      },
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        shiftRequests: {
          where: { staffId: staff.id },
          select: { id: true, status: true },
        },
      },
      orderBy: [{ shiftDate: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({
      shifts: shifts.map((shift) => ({
        id: shift.id,
        shiftDate: shift.shiftDate.toISOString(),
        startTime: shift.startTime,
        endTime: shift.endTime,
        duration: shift.duration,
        serviceType: shift.serviceType,
        location: shift.location,
        requiredRole: shift.requiredRole,
        requiredSkills: shift.requiredSkills,
        participant: shift.participant,
        hasRequested: shift.shiftRequests.length > 0,
      })),
      total: shifts.length,
    });
  } catch (error) {
    console.error("Available shifts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available shifts" },
      { status: 500 }
    );
  }
}
