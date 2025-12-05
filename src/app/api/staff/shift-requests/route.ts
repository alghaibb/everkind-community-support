import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

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
    const { availableShiftId, message } = body;

    if (!availableShiftId) {
      return NextResponse.json(
        { error: "Available shift ID is required" },
        { status: 400 }
      );
    }

    // Check if shift exists and is still available
    const shift = await prisma.availableShift.findUnique({
      where: { id: availableShiftId },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    if (shift.isAssigned) {
      return NextResponse.json(
        { error: "This shift has already been assigned" },
        { status: 400 }
      );
    }

    // Check if staff has already requested this shift
    const existingRequest = await prisma.shiftRequest.findUnique({
      where: {
        staffId_availableShiftId: {
          staffId: staff.id,
          availableShiftId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You have already requested this shift" },
        { status: 400 }
      );
    }

    // Check if staff role matches required role
    if (shift.requiredRole && shift.requiredRole !== staff.staffRole) {
      return NextResponse.json(
        { error: "Your role does not match the requirements for this shift" },
        { status: 400 }
      );
    }

    // Create shift request
    const shiftRequest = await prisma.shiftRequest.create({
      data: {
        staffId: staff.id,
        availableShiftId,
        message,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      shiftRequest: {
        id: shiftRequest.id,
        status: shiftRequest.status,
      },
    });
  } catch (error) {
    console.error("Shift request error:", error);
    return NextResponse.json(
      { error: "Failed to submit shift request" },
      { status: 500 }
    );
  }
}

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

    const whereClause: Record<string, unknown> = { staffId: staff.id };
    if (status) {
      whereClause.status = status;
    }

    const requests = await prisma.shiftRequest.findMany({
      where: whereClause,
      include: {
        availableShift: {
          include: {
            participant: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      requests: requests.map((req) => ({
        id: req.id,
        status: req.status,
        message: req.message,
        rejectionNotes: req.rejectionNotes,
        createdAt: req.createdAt.toISOString(),
        reviewedAt: req.reviewedAt?.toISOString(),
        shift: {
          id: req.availableShift.id,
          shiftDate: req.availableShift.shiftDate.toISOString(),
          startTime: req.availableShift.startTime,
          endTime: req.availableShift.endTime,
          serviceType: req.availableShift.serviceType,
          location: req.availableShift.location,
          participant: req.availableShift.participant,
        },
      })),
    });
  } catch (error) {
    console.error("Get shift requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shift requests" },
      { status: 500 }
    );
  }
}
