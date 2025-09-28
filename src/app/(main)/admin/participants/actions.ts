"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import {
  CreateParticipantFormData,
  createParticipantSchema,
  UpdateParticipantFormData,
  updateParticipantSchema,
} from "@/lib/validations/participant.schema";

export async function createParticipant(data: CreateParticipantFormData) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Validate the data
    const validatedData = createParticipantSchema.parse(data);

    // Create the participant
    const participant = await prisma.participant.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        preferredName: validatedData.preferredName || null,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        gender: validatedData.gender || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address,
        emergencyContact: validatedData.emergencyContact,
        emergencyPhone: validatedData.emergencyPhone,
        emergencyRelation: validatedData.emergencyRelation,
        ndisNumber: validatedData.ndisNumber,
        planStartDate: new Date(validatedData.planStartDate),
        planEndDate: new Date(validatedData.planEndDate),
        ...(validatedData.planBudget
          ? { planBudget: Number(validatedData.planBudget) }
          : {}),
        planManager: validatedData.planManager || null,
        supportCoordinator: validatedData.supportCoordinator || null,
        disabilities: validatedData.disabilities,
        medications: validatedData.medications,
        allergies: validatedData.allergies,
        medicalNotes: validatedData.medicalNotes || null,
        supportNeeds: validatedData.supportNeeds,
        communicationMethod: validatedData.communicationMethod || null,
        behavioralNotes: validatedData.behavioralNotes || null,
        status: validatedData.status,
      },
    });

    revalidatePath("/admin/participants");

    // Convert Decimal objects to plain numbers for client serialization
    const serializedParticipant = {
      ...participant,
      planBudget: participant.planBudget
        ? Number(participant.planBudget)
        : null,
    };

    return {
      success: true,
      message: "Participant created successfully",
      participant: serializedParticipant,
    };
  } catch (error: unknown) {
    console.error("Error creating participant:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      // Unique constraint violation
      const field =
        "meta" in error &&
        error.meta &&
        typeof error.meta === "object" &&
        "target" in error.meta
          ? (error.meta as { target?: string[] }).target?.[0]
          : undefined;
      if (field === "ndisNumber") {
        return { error: "A participant with this NDIS number already exists" };
      }
      if (field === "email") {
        return { error: "A participant with this email already exists" };
      }
      if (field === "phone") {
        return { error: "A participant with this phone number already exists" };
      }
    }

    return { error: "Failed to create participant. Please try again." };
  }
}

export async function updateParticipant(data: UpdateParticipantFormData) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Validate the data
    const validatedData = updateParticipantSchema.parse(data);

    const { id, ...updateData } = validatedData;

    // Update the participant
    const participant = await prisma.participant.update({
      where: { id },
      data: {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        preferredName: updateData.preferredName || null,
        dateOfBirth: updateData.dateOfBirth
          ? new Date(updateData.dateOfBirth)
          : undefined,
        gender: updateData.gender || null,
        email: updateData.email || null,
        phone: updateData.phone || null,
        address: updateData.address,
        emergencyContact: updateData.emergencyContact,
        emergencyPhone: updateData.emergencyPhone,
        emergencyRelation: updateData.emergencyRelation,
        planStartDate: updateData.planStartDate
          ? new Date(updateData.planStartDate)
          : undefined,
        planEndDate: updateData.planEndDate
          ? new Date(updateData.planEndDate)
          : undefined,
        ...(updateData.planBudget
          ? { planBudget: Number(updateData.planBudget) }
          : {}),
        planManager: updateData.planManager || null,
        supportCoordinator: updateData.supportCoordinator || null,
        disabilities: updateData.disabilities,
        medications: updateData.medications,
        allergies: updateData.allergies,
        medicalNotes: updateData.medicalNotes || null,
        supportNeeds: updateData.supportNeeds,
        communicationMethod: updateData.communicationMethod || null,
        behavioralNotes: updateData.behavioralNotes || null,
        status: updateData.status,
      },
    });

    revalidatePath("/admin/participants");

    // Convert Decimal objects to plain numbers for client serialization
    const serializedParticipant = {
      ...participant,
      planBudget: participant.planBudget
        ? Number(participant.planBudget)
        : null,
    };

    return {
      success: true,
      message: "Participant updated successfully",
      participant: serializedParticipant,
    };
  } catch (error: unknown) {
    console.error("Error updating participant:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      // Unique constraint violation
      const field =
        "meta" in error &&
        error.meta &&
        typeof error.meta === "object" &&
        "target" in error.meta
          ? (error.meta as { target?: string[] }).target?.[0]
          : undefined;
      if (field === "ndisNumber") {
        return { error: "A participant with this NDIS number already exists" };
      }
      if (field === "email") {
        return { error: "A participant with this email already exists" };
      }
      if (field === "phone") {
        return { error: "A participant with this phone number already exists" };
      }
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return { error: "Participant not found" };
    }

    return { error: "Failed to update participant. Please try again." };
  }
}

export async function deleteParticipant(id: string) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return { error: "Unauthorized" };
    }

    // Delete the participant
    await prisma.participant.delete({
      where: { id },
    });

    revalidatePath("/admin/participants");

    return {
      success: true,
      message: "Participant deleted successfully",
    };
  } catch (error: unknown) {
    console.error("Error deleting participant:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return { error: "Participant not found" };
    }

    return { error: "Failed to delete participant. Please try again." };
  }
}
