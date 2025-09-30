import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { Prisma, Role, UserType } from "@/generated/prisma";
import { AdminUser } from "@/types/admin";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const userType = searchParams.get("userType") || "";
    const status = searchParams.get("status") || "";

    const where: Prisma.UserWhereInput = {};

    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by role
    if (role && role !== "all") {
      where.role = role as Role;
    }

    // Filter by user type
    if (userType && userType !== "all") {
      where.userType = userType as UserType;
    }

    // Filter by status (active/inactive based on recent activity)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Fetch users with related data
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        userType: true,
        createdAt: true,
        updatedAt: true,
        // Get related staff data if exists
        staffProfile: {
          select: {
            id: true,
            staffRole: true,
            employeeId: true,
            phone: true,
            startDate: true,
            endDate: true,
          },
        },
        // Get related family member data if exists
        familyProfile: {
          select: {
            id: true,
            relationship: true,
            phone: true,
            isEmergencyContact: true,
          },
        },
        // Get session data to determine if user is active
        sessions: {
          select: {
            updatedAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Process users to add computed fields
    const processedUsers: AdminUser[] = users.map((user) => {
      const lastSession = user.sessions[0];
      const isActive = lastSession
        ? lastSession.updatedAt > thirtyDaysAgo
        : false;

      // Determine user status and additional info based on type
      let additionalInfo = null;
      if (user.staffProfile) {
        additionalInfo = {
          type: "staff" as const,
          staffRole: user.staffProfile.staffRole,
          employeeId: user.staffProfile.employeeId,
          phone: user.staffProfile.phone,
          startDate: user.staffProfile.startDate?.toISOString() || null,
          endDate: user.staffProfile.endDate?.toISOString() || null,
        };
      } else if (user.familyProfile) {
        additionalInfo = {
          type: "family" as const,
          relationship: user.familyProfile.relationship,
          phone: user.familyProfile.phone,
          emergencyContact: user.familyProfile.isEmergencyContact,
        };
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        userType: user.userType,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        lastActive: lastSession ? lastSession.updatedAt.toISOString() : null,
        isActive,
        additionalInfo,
      };
    });

    // Apply status filter after processing
    const filteredUsers =
      status === "active"
        ? processedUsers.filter((user) => user.isActive)
        : status === "inactive"
          ? processedUsers.filter((user) => !user.isActive)
          : processedUsers;

    // Get user statistics
    const stats = {
      total: filteredUsers.length,
      active: filteredUsers.filter((user) => user.isActive).length,
      inactive: filteredUsers.filter((user) => !user.isActive).length,
      admins: filteredUsers.filter((user) => user.role === "ADMIN").length,
      staff: filteredUsers.filter((user) => user.role === "STAFF").length,
      internal: filteredUsers.filter((user) => user.userType === "INTERNAL")
        .length,
      family: filteredUsers.filter((user) => user.userType === "FAMILY").length,
    };

    return NextResponse.json({
      users: filteredUsers,
      stats,
      total: filteredUsers.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
