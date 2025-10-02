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

    // Get total count
    const total = await prisma.serviceLog.count({ where });

    // Get service logs with relations
    const serviceLogs = await prisma.serviceLog.findMany({
      where,
      include: {
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
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            staffRole: true,
            employeeId: true,
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

    // Calculate stats
    const stats = {
      total,
      pending: serviceLogs.filter((log) => log.status === "PENDING").length,
      inProgress: serviceLogs.filter((log) => log.status === "IN_PROGRESS")
        .length,
      completed: serviceLogs.filter((log) => log.status === "COMPLETED").length,
      cancelled: serviceLogs.filter((log) => log.status === "CANCELLED").length,
      totalHours: serviceLogs.reduce(
        (sum, log) => sum + Number(log.actualHours),
        0
      ),
      ndisApproved: serviceLogs.filter((log) => log.ndisApproved).length,
    };

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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
