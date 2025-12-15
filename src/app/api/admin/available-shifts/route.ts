import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StaffRole, NotificationType } from "@/generated/prisma";

// GET - Fetch all available shifts
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
    const status = searchParams.get("status"); // all, assigned, unassigned
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const whereClause: Record<string, unknown> = {};

    if (status === "assigned") {
      whereClause.isAssigned = true;
    } else if (status === "unassigned") {
      whereClause.isAssigned = false;
    }

    const [shifts, total] = await Promise.all([
      prisma.availableShift.findMany({
        where: whereClause,
        include: {
          participant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          shiftRequests: {
            include: {
              staff: {
                select: {
                  id: true,
                  staffRole: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: [{ shiftDate: "asc" }, { startTime: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.availableShift.count({ where: whereClause }),
    ]);

    // Get pending requests count
    const pendingRequestsCount = await prisma.shiftRequest.count({
      where: { status: "PENDING" },
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
        isAssigned: shift.isAssigned,
        assignedTo: shift.assignedTo,
        notes: shift.notes,
        participant: shift.participant,
        requests: shift.shiftRequests.map((req) => ({
          id: req.id,
          status: req.status,
          message: req.message,
          createdAt: req.createdAt.toISOString(),
          staff: {
            id: req.staff.id,
            name: req.staff.user.name,
            email: req.staff.user.email,
            role: req.staff.staffRole,
          },
        })),
        pendingRequests: shift.shiftRequests.filter((r) => r.status === "PENDING").length,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      pendingRequestsCount,
    });
  } catch (error) {
    console.error("Admin available shifts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch available shifts" },
      { status: 500 }
    );
  }
}

// POST - Create a new available shift
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as User;

    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      shiftDate,
      startTime,
      endTime,
      serviceType,
      location,
      requiredRole,
      requiredSkills,
      participantId,
      notes,
    } = body;

    // Validation
    if (!shiftDate || !startTime || !endTime || !serviceType || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate duration
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    // Create the available shift
    const shift = await prisma.availableShift.create({
      data: {
        shiftDate: new Date(shiftDate),
        startTime,
        endTime,
        duration,
        serviceType,
        location,
        requiredRole: requiredRole as StaffRole | null,
        requiredSkills: requiredSkills || [],
        participantId: participantId || null,
        notes: notes || null,
      },
      include: {
        participant: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create notifications for all staff members (or only matching role)
    const staffWhereClause: Record<string, unknown> = { isActive: true };
    if (requiredRole) {
      staffWhereClause.staffRole = requiredRole;
    }

    const staffMembers = await prisma.staff.findMany({
      where: staffWhereClause,
      select: { userId: true },
    });

    if (staffMembers.length > 0) {
      const shiftDateFormatted = new Date(shiftDate).toLocaleDateString("en-AU", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      await prisma.notification.createMany({
        data: staffMembers.map((staff) => ({
          userId: staff.userId,
          type: "SHIFT_ASSIGNED" as NotificationType,
          title: "New Shift Available",
          message: `A new ${serviceType} shift is available on ${shiftDateFormatted} at ${location}`,
          link: "/staff/available-shifts",
        })),
      });
    }

    return NextResponse.json({
      success: true,
      shift: {
        id: shift.id,
        shiftDate: shift.shiftDate.toISOString(),
        startTime: shift.startTime,
        endTime: shift.endTime,
        duration: shift.duration,
        serviceType: shift.serviceType,
        location: shift.location,
        participant: shift.participant,
      },
      notifiedStaff: staffMembers.length,
    });
  } catch (error) {
    console.error("Create available shift error:", error);
    return NextResponse.json(
      { error: "Failed to create available shift" },
      { status: 500 }
    );
  }
}

// PUT - Update an available shift
export async function PUT(request: NextRequest) {
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
    const shiftId = searchParams.get("id");

    if (!shiftId) {
      return NextResponse.json(
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.shiftDate) updateData.shiftDate = new Date(body.shiftDate);
    if (body.startTime) updateData.startTime = body.startTime;
    if (body.endTime) updateData.endTime = body.endTime;
    if (body.serviceType) updateData.serviceType = body.serviceType;
    if (body.location) updateData.location = body.location;
    if (body.requiredRole !== undefined) updateData.requiredRole = body.requiredRole;
    if (body.requiredSkills) updateData.requiredSkills = body.requiredSkills;
    if (body.participantId !== undefined) updateData.participantId = body.participantId;
    if (body.notes !== undefined) updateData.notes = body.notes;

    // Recalculate duration if times changed
    if (body.startTime && body.endTime) {
      const start = new Date(`2000-01-01T${body.startTime}`);
      const end = new Date(`2000-01-01T${body.endTime}`);
      if (end < start) end.setDate(end.getDate() + 1);
      updateData.duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }

    const shift = await prisma.availableShift.update({
      where: { id: shiftId },
      data: updateData,
    });

    return NextResponse.json({ success: true, shift });
  } catch (error) {
    console.error("Update available shift error:", error);
    return NextResponse.json(
      { error: "Failed to update available shift" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an available shift
export async function DELETE(request: NextRequest) {
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
    const shiftId = searchParams.get("id");

    if (!shiftId) {
      return NextResponse.json(
        { error: "Shift ID is required" },
        { status: 400 }
      );
    }

    await prisma.availableShift.delete({
      where: { id: shiftId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete available shift error:", error);
    return NextResponse.json(
      { error: "Failed to delete available shift" },
      { status: 500 }
    );
  }
}
