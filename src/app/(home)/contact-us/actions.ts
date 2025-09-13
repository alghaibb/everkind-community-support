"use server";

import {
  contactSchema,
  ContactFormValues,
} from "@/lib/validations/contact.schema";
import prisma from "@/lib/prisma";

export async function sendContactForm(values: ContactFormValues) {
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
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

  return {
    success: "Message sent successfully, we will get back to you soon.",
  };
}
