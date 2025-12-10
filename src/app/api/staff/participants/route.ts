import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { cachedJson, CACHE_TIMES } from "@/lib/performance";

export async function GET() {
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

    // Get participants assigned to this staff member
    const assignments = await prisma.participantStaff.findMany({
      where: {
        staffId: staff.id,
        endDate: null, // Only active assignments
      },
      include: {
        participant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            preferredName: true,
            phone: true,
            email: true,
            supportNeeds: true,
            communicationMethod: true,
          },
        },
      },
    });

    // Cache participants for 15 minutes (semi-static)
    return cachedJson({
      participants: assignments.map((a) => ({
        id: a.participant.id,
        firstName: a.participant.firstName,
        lastName: a.participant.lastName,
        preferredName: a.participant.preferredName,
        phone: a.participant.phone,
        email: a.participant.email,
        supportNeeds: a.participant.supportNeeds,
        communicationMethod: a.participant.communicationMethod,
        isPrimary: a.isPrimary,
      })),
      total: assignments.length,
    }, CACHE_TIMES.SEMI_STATIC);
  } catch (error) {
    console.error("Staff participants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}
