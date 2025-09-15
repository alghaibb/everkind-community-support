"use server";

import {
  contactSchema,
  ContactFormValues,
} from "@/lib/validations/contact.schema";
import prisma from "@/lib/prisma";
import { createErrorResponse, createSuccessResponse } from "@/lib/form-utils";

/**
 * Submits contact form with validation and error handling
 * @param values - Contact form data to submit
 * @returns Promise with success/error result
 */
export async function sendContactForm(values: ContactFormValues) {
  try {
    const validatedFields = contactSchema.safeParse(values);

    if (!validatedFields.success) {
      return createErrorResponse("Invalid fields. Please check your input and try again.", validatedFields.error);
    }

    const { data } = validatedFields;

    await prisma.contactMessage.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      },
    });

    return createSuccessResponse("Message sent successfully, we will get back to you soon.");
  } catch (error) {
    return createErrorResponse("Failed to submit message. Please try again.", error);
  }
}
