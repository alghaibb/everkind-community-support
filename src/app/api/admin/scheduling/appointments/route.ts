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

    // Get total count
    const total = await prisma.appointment.count({ where });

    // Get appointments with relations
    const appointments = await prisma.appointment.findMany({
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

    // Calculate stats
    const stats = {
      total,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      totalHours: appointments.reduce((sum, a) => sum + a.duration, 0) / 60, // Convert to hours
    };

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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
