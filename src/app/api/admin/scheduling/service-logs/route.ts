import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma, ServiceStatus } from "@/generated/prisma";

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
    const where: Prisma.ServiceLogWhereInput = {};

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
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.status = status as ServiceStatus;
    }

    // Get total count for pagination
    const total = await prisma.serviceLog.count({ where });

    // Calculate OVERALL stats (without status filter) for dashboard display
    const overallWhere: Prisma.ServiceLogWhereInput = {};

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
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate stats using database aggregations (more efficient)
    const statsPromises = [
      // Count by status (overall)
      prisma.serviceLog.groupBy({
        by: ["status"],
        where: overallWhere,
        _count: { id: true },
      }),
      // Sum of actual hours (overall)
      prisma.serviceLog.aggregate({
        where: overallWhere,
        _sum: { actualHours: true },
      }),
      // Count NDIS approved (overall)
      prisma.serviceLog.count({
        where: { ...overallWhere, ndisApproved: true },
      }),
    ];

    const [statusCountsResult, hoursSumResult, ndisApprovedCountResult] =
      await Promise.all(statsPromises);

    // Type-safe extraction of results
    const statusCounts = statusCountsResult as Array<{
      status: ServiceStatus;
      _count: { id: number };
    }>;
    const hoursSum = hoursSumResult as { _sum: { actualHours: number | null } };
    const ndisApprovedCount = ndisApprovedCountResult as number;

    // Build stats object (always shows overall stats)
    const stats = {
      total: await prisma.serviceLog.count({ where: overallWhere }),
      pending: statusCounts.find((s) => s.status === "PENDING")?._count.id || 0,
      inProgress:
        statusCounts.find((s) => s.status === "IN_PROGRESS")?._count.id || 0,
      completed:
        statusCounts.find((s) => s.status === "COMPLETED")?._count.id || 0,
      cancelled:
        statusCounts.find((s) => s.status === "CANCELLED")?._count.id || 0,
      totalHours: Number(hoursSum._sum.actualHours || 0),
      ndisApproved: ndisApprovedCount,
    };

    // Get service logs with optimized includes
    const serviceLogs = await prisma.serviceLog.findMany({
      where,
      select: {
        id: true,
        appointmentId: true,
        serviceDate: true,
        startTime: true,
        endTime: true,
        actualHours: true,
        serviceType: true,
        description: true,
        location: true,
        status: true,
        notes: true,
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
        appointment: {
          select: {
            id: true,
            appointmentDate: true,
            serviceType: true,
            status: true,
          },
        },
      },
      orderBy: [{ serviceDate: "desc" }, { startTime: "desc" }],
      skip,
      take: pageSize,
    });

    // Format the response
    const formattedServiceLogs = serviceLogs.map((log) => ({
      id: log.id,
      appointmentId: log.appointmentId,
      participant: {
        id: log.participant.id,
        name: `${log.participant.firstName} ${log.participant.lastName}`,
        ndisNumber: log.participant.ndisNumber,
        email: log.participant.email,
        phone: log.participant.phone,
      },
      staff: {
        id: log.staff.id,
        name: log.staff.user.name,
        email: log.staff.user.email,
        role: log.staff.staffRole,
        employeeId: log.staff.employeeId,
      },
      serviceDate: log.serviceDate.toISOString().split("T")[0],
      startTime: log.startTime,
      endTime: log.endTime,
      actualHours: log.actualHours.toString(),
      serviceType: log.serviceType,
      description: log.description,
      location: log.location,
      status: log.status,
      notes: log.notes,
      ndisApproved: log.ndisApproved,
      appointment: log.appointment,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      serviceLogs: formattedServiceLogs,
      stats,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        total,
      },
    });
  } catch (error) {
    console.error("Service logs API error:", error);

    // Check for specific database connection errors
    if (error instanceof Error) {
      if (
        error.message.includes("connection") ||
        error.message.includes("pool")
      ) {
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
