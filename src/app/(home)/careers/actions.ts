"use server";

import { getCareerSchema } from "@/lib/validations/careers/career.schema";
import prisma from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse } from "@/lib/form-utils";

/**
 * Submits career application with role-specific validation
 * @param values - Career application form data
 * @returns Promise with success message or error
 */
export async function sendCareerApplication(values: Record<string, unknown>) {
  try {
    // Validate with dynamic schema
    const schema = getCareerSchema(values.role as string);
    const result = schema.safeParse(values);

    if (!result.success) {
      return createErrorResponse("Invalid fields", result.error);
    }

    const data = result.data;

    // Create submission
    await prisma.careerSubmission.create({
      data: {
        // Basic info
        role: data.role || "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,

        // Role-specific certifications
        cert3IndividualSupport: data.role === "Support Worker" && "cert3IndividualSupport" in data
          ? data.cert3IndividualSupport || ""
          : "",
        ahpraRegistration: data.role !== "Support Worker" && "ahpraRegistration" in data
          ? data.ahpraRegistration || null
          : null,

        // Common fields
        covidVaccinations: data.covidVaccinations,
        influenzaVaccination: data.influenzaVaccination,
        workingWithChildrenCheck: data.workingWithChildrenCheck,
        ndisScreeningCheck: data.ndisScreeningCheck,
        policeCheck: data.policeCheck,
        workingRights: data.workingRights,
        ndisModules: data.ndisModules,
        firstAidCPR: data.firstAidCPR,
        experience: data.experience,
        availability: data.availability,
        resume: data.resume,
        certificates: data.certificates,
      },
    });

    return createSuccessResponse(
      "Application submitted successfully! We'll review your qualifications and get back to you soon."
    );
  } catch (error) {
    return createErrorResponse("Failed to submit application. Please try again.", error);
  }
}