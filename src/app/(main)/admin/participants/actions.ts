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
import {
  handleParticipantError,
  serializeParticipant,
} from "@/utils/participant-utils";

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
        preferredName: validatedData.preferredName || undefined,
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

    return {
      success: true,
      message: "Participant created successfully",
      participant: serializeParticipant(participant),
    };
  } catch (error) {
    console.error("Error creating participant:", error);
    return handleParticipantError(error, "create");
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
        preferredName: updateData.preferredName || undefined,
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

    return {
      success: true,
      message: "Participant updated successfully",
      participant: serializeParticipant(participant),
    };
  } catch (error) {
    console.error("Error updating participant:", error);
    return handleParticipantError(error, "update");
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
  } catch (error) {
    console.error("Error deleting participant:", error);
    return handleParticipantError(error, "delete");
  }
}
