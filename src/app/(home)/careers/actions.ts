"use server";

import {
  careerSchema,
  CareerFormValues,
} from "@/lib/validations/career.schema";
import prisma from "@/lib/prisma";

export async function sendCareerApplication(values: CareerFormValues) {
  const validatedFields = careerSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { data } = validatedFields;

  await prisma.careerSubmission.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,

      // Certifications & Qualifications
      cert3IndividualSupport: data.cert3IndividualSupport,
      covidVaccinations: data.covidVaccinations,
      influenzaVaccination: data.influenzaVaccination,

      // Checks & Clearances
      workingWithChildrenCheck: data.workingWithChildrenCheck,
      ndisScreeningCheck: data.ndisScreeningCheck,
      policeCheck: data.policeCheck,
      workingRights: data.workingRights,

      // Training & Modules
      ndisModules: data.ndisModules,
      firstAidCPR: data.firstAidCPR,

      // Experience & Availability
      experience: data.experience,
      availability: data.availability,

      // File Uploads
      resume: data.resume,
      certificates: data.certificates,
      references: data.references,
    },
  });

  return {
    success:
      "Application submitted successfully! We'll review your qualifications and get back to you soon.",
  };
}
