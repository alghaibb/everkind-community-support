import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ShiftStatus, Prisma } from "@/generated/prisma";

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
    const week = searchParams.get("week") || "current";
    const search = searchParams.get("search");

    // Calculate date range based on week parameter
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)

    let dateFilter: { gte?: Date; lt?: Date } = {};

    if (week === "previous") {
      const previousWeekStart = new Date(startOfWeek);
      previousWeekStart.setDate(startOfWeek.getDate() - 7);
      const previousWeekEnd = new Date(startOfWeek);

      dateFilter = {
        gte: previousWeekStart,
        lt: previousWeekEnd,
      };
    } else if (week === "next") {
      const nextWeekStart = new Date(startOfWeek);
      nextWeekStart.setDate(startOfWeek.getDate() + 7);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

      dateFilter = {
        gte: nextWeekStart,
        lt: nextWeekEnd,
      };
    } else {
      // Current week (default)
      const nextWeekStart = new Date(startOfWeek);
      nextWeekStart.setDate(startOfWeek.getDate() + 7);

      dateFilter = {
        gte: startOfWeek,
        lt: nextWeekStart,
      };
    }

    // Get staff shifts with basic info
    const shifts = await prisma.staffShift.findMany({
      where: {
        shiftDate: dateFilter,
        ...(search && {
          staff: {
            OR: [
              { user: { name: { contains: search, mode: "insensitive" } } },
              { employeeId: { contains: search, mode: "insensitive" } },
            ],
          },
        }),
      },
      select: {
        id: true,
        shiftDate: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        notes: true,
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
            staffRole: true,
            employeeId: true,
          },
        },
      },
      orderBy: [{ shiftDate: "asc" }, { startTime: "asc" }],
    });

    // Calculate some basic stats
    const stats = {
      totalShifts: shifts.length,
      scheduledShifts: shifts.filter(s => s.status === "SCHEDULED").length,
      completedShifts: shifts.filter(s => s.status === "COMPLETED").length,
      cancelledShifts: shifts.filter(s => s.status === "CANCELLED").length,
    };

    return NextResponse.json({
      shifts,
      stats,
      week: {
        start: dateFilter.gte?.toISOString().split("T")[0],
        end: dateFilter.lt?.toISOString().split("T")[0],
        type: week,
      },
    });
  } catch (error) {
    console.error("Staff shifts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const user = session.user as User;

    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();

    // Extract and validate required fields
    const staffId = formData.get("staffId")?.toString().trim();
    const shiftDateStr = formData.get("shiftDate")?.toString();
    const startTime = formData.get("startTime")?.toString();
    const endTime = formData.get("endTime")?.toString();

    if (!staffId || !shiftDateStr || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert and validate data types
    const shiftDate = new Date(shiftDateStr);

    // Calculate duration
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end < start) end.setDate(end.getDate() + 1);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    const statusStr = formData.get("status")?.toString() || "SCHEDULED";
    const status = statusStr as ShiftStatus;

    const shiftData = {
      staffId,
      shiftDate,
      startTime,
      endTime,
      duration,
      notes: formData.get("notes")?.toString(),
      status,
    };

    // Create the shift
    const newShift = await prisma.staffShift.create({
      data: shiftData,
      select: {
        id: true,
        shiftDate: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        notes: true,
        staff: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
            staffRole: true,
            employeeId: true,
          },
        },
      },
    });

    return NextResponse.json(newShift);
  } catch (error) {
    console.error("Create shift API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ error: "Shift ID is required" }, { status: 400 });
    }

    const formData = await request.formData();
    const updateData: Prisma.StaffShiftUncheckedUpdateInput = {};

    // Extract form data
    const staffId = formData.get("staffId")?.toString().trim();
    const shiftDateStr = formData.get("shiftDate")?.toString();
    const startTime = formData.get("startTime")?.toString();
    const endTime = formData.get("endTime")?.toString();
    const notes = formData.get("notes")?.toString();
    const statusStr = formData.get("status")?.toString();

    // Validate and handle staffId (foreign key field)
    if (staffId !== undefined) {
      if (staffId === "" || staffId === null) {
        // Don't update staffId if it's empty/null
        console.log("Skipped empty staffId update");
      } else {
        // staffId should be a valid string (CUID)
        if (staffId.length === 0) {
          return NextResponse.json(
            { error: "Staff ID cannot be empty" },
            { status: 400 }
          );
        }
        updateData.staffId = staffId;
      }
    }

    if (shiftDateStr) {
      updateData.shiftDate = new Date(shiftDateStr);
    }

    if (startTime !== undefined) {
      updateData.startTime = startTime;
    }

    if (endTime !== undefined) {
      updateData.endTime = endTime;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (statusStr !== undefined) {
      updateData.status = statusStr as ShiftStatus;
    }

    // Recalculate duration if start/end times changed
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      if (end < start) end.setDate(end.getDate() + 1);
      updateData.duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }

    // Check if shift exists first
    const existingShift = await prisma.staffShift.findUnique({
      where: { id: shiftId }
    });

    if (!existingShift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    try {
      // Update the shift
      const updatedShift = await prisma.staffShift.update({
        where: { id: shiftId },
        data: updateData,
        select: {
          id: true,
          shiftDate: true,
          startTime: true,
          endTime: true,
          duration: true,
          status: true,
          notes: true,
          staff: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                },
              },
              staffRole: true,
              employeeId: true,
            },
          },
        },
      });

      return NextResponse.json(updatedShift);
    } catch (updateError: unknown) {
      console.error("Prisma update error:", updateError);

      // Handle specific Prisma errors
      if (updateError instanceof PrismaClientKnownRequestError) {
        if (updateError.code === 'P2025') {
          return NextResponse.json(
            { error: "Shift not found" },
            { status: 404 }
          );
        }

        if (updateError.code === 'P2003') {
          return NextResponse.json(
            { error: "Invalid staff member - staff does not exist" },
            { status: 400 }
          );
        }

        if (updateError.code === 'P2002') {
          return NextResponse.json(
            { error: "Duplicate entry" },
            { status: 409 }
          );
        }

        // Log the full error for debugging
        console.error("Full update error:", {
          code: updateError.code,
          message: updateError.message,
          meta: updateError.meta
        });

        return NextResponse.json(
          { error: `Database error: ${updateError.message || 'Unknown error'}` },
          { status: 500 }
        );
      }

      // For non-Prisma errors
      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ error: "Shift ID is required" }, { status: 400 });
    }

    // Delete the shift
    await prisma.staffShift.delete({
      where: { id: shiftId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete shift API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
