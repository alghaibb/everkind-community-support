import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: staff.id,
      user: staff.user,
      staffRole: staff.staffRole,
      employeeId: staff.employeeId,
      startDate: staff.startDate.toISOString(),
      phone: staff.phone,
      emergencyContact: staff.emergencyContact,
      emergencyPhone: staff.emergencyPhone,
      address: staff.address,
      certifications: {
        cert3IndividualSupport: staff.cert3IndividualSupport,
        ahpraRegistration: staff.ahpraRegistration,
        covidVaccinations: staff.covidVaccinations,
        influenzaVaccination: staff.influenzaVaccination,
        workingWithChildrenCheck: staff.workingWithChildrenCheck,
        ndisScreeningCheck: staff.ndisScreeningCheck,
        policeCheck: staff.policeCheck,
        firstAidCPR: staff.firstAidCPR,
      },
      ndisModules: staff.ndisModules,
      availability: staff.availability,
    });
  } catch (error) {
    console.error("Staff profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
