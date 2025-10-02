import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, AppointmentStatus } from "@/generated/prisma";

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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: Prisma.AppointmentWhereInput = {};

    if (search) {
      where.OR = [
        {
          participant: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { preferredName: { contains: search, mode: "insensitive" } },
              { ndisNumber: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          staff: {
            user: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
        { serviceType: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.status = status as AppointmentStatus;
    }

    // Get total count for pagination
    const total = await prisma.appointment.count({ where });

    // Calculate OVERALL stats (without filters) for dashboard display
    const overallWhere: Prisma.AppointmentWhereInput = {};

    // Add search filter to overall stats if present
    if (search) {
      overallWhere.OR = [
        {
          participant: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { preferredName: { contains: search, mode: "insensitive" } },
              { ndisNumber: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          staff: {
            user: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
        { serviceType: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate stats using database aggregations (more efficient)
    const statsPromises = [
      // Count by status (overall)
      prisma.appointment.groupBy({
        by: ["status"],
        where: overallWhere,
        _count: { id: true },
      }),
      // Sum of duration (in minutes, convert to hours) (overall)
      prisma.appointment.aggregate({
        where: overallWhere,
        _sum: { duration: true },
      }),
    ];

    const [statusCountsResult, durationSumResult] = await Promise.all(statsPromises);

    // Type-safe extraction of results
    const statusCounts = statusCountsResult as Array<{ status: AppointmentStatus; _count: { id: number } }>;
    const durationSum = durationSumResult as { _sum: { duration: number | null } };

    // Build stats object (always shows overall stats)
    const stats = {
      total: await prisma.appointment.count({ where: overallWhere }),
      confirmed: statusCounts.find(s => s.status === "CONFIRMED")?._count.id || 0,
      pending: statusCounts.find(s => s.status === "PENDING")?._count.id || 0,
      cancelled: statusCounts.find(s => s.status === "CANCELLED")?._count.id || 0,
      completed: statusCounts.find(s => s.status === "COMPLETED")?._count.id || 0,
      totalHours: (durationSum._sum.duration || 0) / 60, // Convert minutes to hours
    };

    // Get appointments with optimized select
    const appointments = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        appointmentDate: true,
        startTime: true,
        endTime: true,
        duration: true,
        serviceType: true,
        location: true,
        notes: true,
        status: true,
        ndisApproved: true,
        createdAt: true,
        updatedAt: true,
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            preferredName: true,
            ndisNumber: true,
            email: true,
            phone: true,
            },
          },
        staff: {
          select: {
            id: true,
            employeeId: true,
            staffRole: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        serviceLogs: {
          select: {
            id: true,
            status: true,
            actualHours: true,
            serviceDate: true,
          },
          orderBy: {
            serviceDate: "desc",
          },
        },
      },
      orderBy: [{ appointmentDate: "desc" }, { startTime: "asc" }],
      skip,
      take: pageSize,
    });

    // Format the response
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      participant: {
        id: appointment.participant.id,
        name: `${appointment.participant.firstName} ${appointment.participant.lastName}`,
        ndisNumber: appointment.participant.ndisNumber,
        email: appointment.participant.email,
        phone: appointment.participant.phone,
      },
      staff: appointment.staff
        ? {
            id: appointment.staff.id,
            name: appointment.staff.user.name,
            email: appointment.staff.user.email,
            role: appointment.staff.staffRole,
            employeeId: appointment.staff.employeeId,
          }
        : null,
      appointmentDate: appointment.appointmentDate.toISOString().split("T")[0],
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      duration: appointment.duration,
      serviceType: appointment.serviceType,
      location: appointment.location,
      notes: appointment.notes,
      status: appointment.status,
      ndisApproved: appointment.ndisApproved,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
      serviceLogs: appointment.serviceLogs,
    }));

    return NextResponse.json({
      appointments: formattedAppointments,
      stats,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        total,
      },
    });
  } catch (error) {
    console.error("Appointments API error:", error);

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
