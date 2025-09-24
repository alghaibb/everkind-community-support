import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateTempPassword } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/email-service";
import { env } from "@/lib/env";
import { StaffRole } from "@/generated/prisma";
import { AvailabilityData } from "@/types/career";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { careerId, staffRole, startDate } = await request.json();

    if (!careerId || !staffRole || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the career submission
    const career = await prisma.careerSubmission.findUnique({
      where: { id: careerId },
    });

    if (!career) {
      return NextResponse.json(
        { error: "Career submission not found" },
        { status: 404 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: career.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create user account using Better Auth
    const userResult = await auth.api.signUpEmail({
      body: {
        email: career.email,
        password: tempPassword,
        name: `${career.firstName} ${career.lastName}`,
      },
    });

    if (!userResult) {
      throw new Error("Failed to create user account");
    }

    // Update user with role and userType
    await prisma.user.update({
      where: { email: career.email },
      data: {
        userType: "INTERNAL",
        role: "STAFF",
        emailVerified: true,
      },
    });

    // Get the created user
    const user = await prisma.user.findUnique({
      where: { email: career.email },
    });

    if (!user) {
      throw new Error("Failed to retrieve created user");
    }

    // Create staff profile
    await prisma.staff.create({
      data: {
        userId: user.id,
        staffRole: staffRole as StaffRole,
        startDate: new Date(startDate),
        phone: career.phone,
        cert3IndividualSupport: career.cert3IndividualSupport === "Yes",
        ahpraRegistration: career.ahpraRegistration || null,
        covidVaccinations: career.covidVaccinations === "Yes",
        influenzaVaccination: career.influenzaVaccination === "Yes",
        workingWithChildrenCheck: career.workingWithChildrenCheck === "Yes",
        ndisScreeningCheck: career.ndisScreeningCheck === "Yes",
        policeCheck: career.policeCheck === "Yes",
        firstAidCPR: career.firstAidCPR === "Yes",
        workingRights: career.workingRights === "Yes",
        ndisModules: career.ndisModules.split(",").map(m => m.trim()),
        availability: career.availability as AvailabilityData,
        resume: career.resume,
        certificates: career.certificates,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail({
        to: career.email,
        name: `${career.firstName} ${career.lastName}`,
        tempPassword,
        loginUrl: `${env.NEXT_PUBLIC_BASE_URL}/staff-login`,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the entire operation if email fails
    }

    // Mark career submission as processed (optional)
    await prisma.careerSubmission.update({
      where: { id: careerId },
      data: {
        // You could add a processed field to track this
        // processed: true,
        // processedAt: new Date(),
        // processedBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Staff account created successfully",
    });
  } catch (error) {
    console.error("Error creating staff from career:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
