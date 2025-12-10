import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
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
    const status = searchParams.get("status");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const today = new Date();

    // Build where clause
    const whereClause: Record<string, unknown> = { staffId: staff.id };

    if (status) {
      whereClause.status = status;
    } else {
      // Default to upcoming appointments
      whereClause.appointmentDate = {
        gte: startOfDay(today),
      };
    }

    if (startDateParam || endDateParam) {
      whereClause.appointmentDate = {};
      if (startDateParam) {
        (whereClause.appointmentDate as Record<string, unknown>).gte = new Date(startDateParam);
      }
      if (endDateParam) {
        (whereClause.appointmentDate as Record<string, unknown>).lte = new Date(endDateParam);
      }
    }

    // Calculate stats efficiently using count queries (parallel execution)
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    // Fetch appointments and counts in parallel for better performance
    const [appointments, todayCount, weekCount] = await Promise.all([
      // Get appointments with lean includes
      prisma.appointment.findMany({
        where: whereClause,
        include: {
          participant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              address: true,
            },
          },
        },
        orderBy: [{ appointmentDate: "asc" }, { startTime: "asc" }],
        take: 100, // Limit for performance
      }),
      // Today's count
      prisma.appointment.count({
        where: {
          staffId: staff.id,
          appointmentDate: { gte: todayStart, lte: todayEnd },
          status: { not: "CANCELLED" },
        },
      }),
      // Week's count
      prisma.appointment.count({
        where: {
          staffId: staff.id,
          appointmentDate: { gte: weekStart, lte: weekEnd },
          status: { not: "CANCELLED" },
        },
      }),
    ]);

    // Cache appointments for 1 minute
    return cachedJson({
      appointments: appointments.map((a) => ({
        id: a.id,
        appointmentDate: a.appointmentDate.toISOString(),
        startTime: a.startTime,
        endTime: a.endTime,
        duration: a.duration,
        serviceType: a.serviceType,
        location: a.location,
        status: a.status,
        notes: a.notes,
        participant: {
          id: a.participant.id,
          firstName: a.participant.firstName,
          lastName: a.participant.lastName,
          phone: a.participant.phone,
          address: a.participant.address,
        },
      })),
      total: appointments.length,
      todayCount,
      weekCount,
    }, CACHE_TIMES.DYNAMIC);
  } catch (error) {
    console.error("Staff appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
