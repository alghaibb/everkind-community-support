import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { User } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NotificationType } from "@/generated/prisma";

// GET - Fetch all shift requests (for admin review)
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
    const status = searchParams.get("status"); // PENDING, APPROVED, REJECTED
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const whereClause: Record<string, unknown> = {};

    if (status) {
      whereClause.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.shiftRequest.findMany({
        where: whereClause,
        include: {
          staff: {
            select: {
              id: true,
              staffRole: true,
              employeeId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shiftRequest.count({ where: whereClause }),
    ]);

    // Get status counts
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.shiftRequest.count({ where: { status: "PENDING" } }),
      prisma.shiftRequest.count({ where: { status: "APPROVED" } }),
      prisma.shiftRequest.count({ where: { status: "REJECTED" } }),
    ]);

    return NextResponse.json({
      requests: requests.map((req) => ({
        id: req.id,
        status: req.status,
        message: req.message,
        rejectionNotes: req.rejectionNotes,
        createdAt: req.createdAt.toISOString(),
        reviewedAt: req.reviewedAt?.toISOString(),
        staff: {
          id: req.staff.id,
          userId: req.staff.user.id,
          name: req.staff.user.name,
          email: req.staff.user.email,
          image: req.staff.user.image,
          role: req.staff.staffRole,
          employeeId: req.staff.employeeId,
        },
        shift: {
          id: req.availableShift.id,
          shiftDate: req.availableShift.shiftDate.toISOString(),
          startTime: req.availableShift.startTime,
          endTime: req.availableShift.endTime,
          duration: req.availableShift.duration,
          serviceType: req.availableShift.serviceType,
          location: req.availableShift.location,
          isAssigned: req.availableShift.isAssigned,
          participant: req.availableShift.participant,
        },
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error("Admin shift requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shift requests" },
      { status: 500 }
    );
  }
}

// PUT - Approve or reject a shift request
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
    const requestId = searchParams.get("id");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, rejectionNotes } = body;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the shift request with related data
    const shiftRequest = await prisma.shiftRequest.findUnique({
      where: { id: requestId },
      include: {
        staff: {
          select: {
            id: true,
            userId: true,
            user: {
              select: { name: true },
            },
          },
        },
        availableShift: true,
      },
    });

    if (!shiftRequest) {
      return NextResponse.json(
        { error: "Shift request not found" },
        { status: 404 }
      );
    }

    if (shiftRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "This request has already been processed" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Check if shift is already assigned
      if (shiftRequest.availableShift.isAssigned) {
        return NextResponse.json(
          { error: "This shift has already been assigned to someone else" },
          { status: 400 }
        );
      }

      // Use a transaction to approve the request, assign the shift, and reject other requests
      await prisma.$transaction(async (tx) => {
        // Approve this request
        await tx.shiftRequest.update({
          where: { id: requestId },
          data: {
            status: "APPROVED",
            reviewedBy: user.id,
            reviewedAt: new Date(),
          },
        });

        // Assign the shift to this staff member
        await tx.availableShift.update({
          where: { id: shiftRequest.availableShiftId },
          data: {
            isAssigned: true,
            assignedTo: shiftRequest.staffId,
          },
        });

        // Also create a StaffShift record for the assigned staff
        await tx.staffShift.create({
          data: {
            staffId: shiftRequest.staffId,
            shiftDate: shiftRequest.availableShift.shiftDate,
            startTime: shiftRequest.availableShift.startTime,
            endTime: shiftRequest.availableShift.endTime,
            duration: shiftRequest.availableShift.duration,
            status: "SCHEDULED",
            notes: `From available shift pickup - ${shiftRequest.availableShift.serviceType}`,
          },
        });

        // Reject all other pending requests for this shift
        const otherRequests = await tx.shiftRequest.findMany({
          where: {
            availableShiftId: shiftRequest.availableShiftId,
            id: { not: requestId },
            status: "PENDING",
          },
          include: {
            staff: {
              select: { userId: true },
            },
          },
        });

        if (otherRequests.length > 0) {
          await tx.shiftRequest.updateMany({
            where: {
              availableShiftId: shiftRequest.availableShiftId,
              id: { not: requestId },
              status: "PENDING",
            },
            data: {
              status: "REJECTED",
              reviewedBy: user.id,
              reviewedAt: new Date(),
              rejectionNotes: "Shift was assigned to another staff member",
            },
          });

          // Notify rejected staff members
          await tx.notification.createMany({
            data: otherRequests.map((req) => ({
              userId: req.staff.userId,
              type: "SHIFT_REQUEST_REJECTED" as NotificationType,
              title: "Shift Request Not Selected",
              message: `Your request for the ${shiftRequest.availableShift.serviceType} shift was not selected. The shift has been assigned to another team member.`,
              link: "/staff/available-shifts",
            })),
          });
        }

        // Notify the approved staff member
        const shiftDateFormatted = shiftRequest.availableShift.shiftDate.toLocaleDateString("en-AU", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        await tx.notification.create({
          data: {
            userId: shiftRequest.staff.userId,
            type: "SHIFT_REQUEST_APPROVED" as NotificationType,
            title: "Shift Request Approved! 🎉",
            message: `Your request for the ${shiftRequest.availableShift.serviceType} shift on ${shiftDateFormatted} has been approved. Check your schedule for details.`,
            link: "/staff/schedule",
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Shift request approved successfully",
        staffName: shiftRequest.staff.user.name,
      });
    } else {
      // Reject the request
      await prisma.shiftRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          reviewedBy: user.id,
          reviewedAt: new Date(),
          rejectionNotes: rejectionNotes || null,
        },
      });

      // Notify the staff member
      const shiftDateFormatted = shiftRequest.availableShift.shiftDate.toLocaleDateString("en-AU", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      await prisma.notification.create({
        data: {
          userId: shiftRequest.staff.userId,
          type: "SHIFT_REQUEST_REJECTED" as NotificationType,
          title: "Shift Request Not Approved",
          message: rejectionNotes
            ? `Your request for the ${shiftRequest.availableShift.serviceType} shift on ${shiftDateFormatted} was not approved. Reason: ${rejectionNotes}`
            : `Your request for the ${shiftRequest.availableShift.serviceType} shift on ${shiftDateFormatted} was not approved.`,
          link: "/staff/available-shifts",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Shift request rejected",
      });
    }
  } catch (error) {
    console.error("Process shift request error:", error);
    return NextResponse.json(
      { error: "Failed to process shift request" },
      { status: 500 }
    );
  }
}
