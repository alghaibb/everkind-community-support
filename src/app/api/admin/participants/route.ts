import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { ParticipantStatus, Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const disability = searchParams.get("disability") || "";
    const supportCoordinator = searchParams.get("supportCoordinator") || "";

    // Build where clause
    const where: Prisma.ParticipantWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { preferredName: { contains: search, mode: "insensitive" } },
        { ndisNumber: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status as ParticipantStatus;
    }

    if (disability) {
      where.disabilities = {
        has: disability,
      };
    }

    if (supportCoordinator) {
      where.supportCoordinator = {
        contains: supportCoordinator,
        mode: "insensitive",
      };
    }

    const participants = await prisma.participant.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        preferredName: true,
        dateOfBirth: true,
        gender: true,
        email: true,
        phone: true,
        address: true,
        emergencyContact: true,
        emergencyPhone: true,
        emergencyRelation: true,
        ndisNumber: true,
        planStartDate: true,
        planEndDate: true,
        planBudget: true,
        planManager: true,
        supportCoordinator: true,
        disabilities: true,
        medications: true,
        allergies: true,
        medicalNotes: true,
        supportNeeds: true,
        communicationMethod: true,
        behavioralNotes: true,
        status: true,
        createdAt: true,
      },
    });

    // Convert Decimal objects to plain numbers for client serialization
    const serializedParticipants = participants.map((participant) => ({
      ...participant,
      planBudget: participant.planBudget
        ? Number(participant.planBudget)
        : null,
    }));

    return NextResponse.json({
      participants: serializedParticipants,
      total: participants.length,
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
