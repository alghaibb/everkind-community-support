import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// Sample participant data
const participantData = [
  {
    firstName: "John",
    lastName: "Smith",
    preferredName: "Johnny",
    dateOfBirth: new Date("1985-03-15"),
    gender: "Male",
    email: "john.smith@example.com",
    phone: "0412345678",
    address: "123 Oak Street, Melbourne VIC 3000",
    emergencyContact: "Jane Smith",
    emergencyPhone: "0412987654",
    emergencyRelation: "Wife",
    ndisNumber: "4100000001",
    planStartDate: new Date("2024-01-01"),
    planEndDate: new Date("2024-12-31"),
    planBudget: 85000.0,
    planManager: "Sarah Johnson",
    supportCoordinator: "Mike Brown",
    disabilities: ["Cerebral Palsy", "Intellectual Disability"],
    medications: ["Baclofen 10mg", "Vitamin D"],
    allergies: ["Penicillin", "Nuts"],
    medicalNotes:
      "Requires assistance with mobility and daily living activities",
    supportNeeds: ["Personal Care", "Mobility Support", "Home Modifications"],
    communicationMethod: "Verbal",
    behavioralNotes: "Generally cooperative, occasional frustration when tired",
    status: "ACTIVE" as const,
  },
  {
    firstName: "Emma",
    lastName: "Thompson",
    preferredName: "Em",
    dateOfBirth: new Date("1992-07-22"),
    gender: "Female",
    email: "emma.thompson@example.com",
    phone: "0423456789",
    address: "456 Elm Avenue, Melbourne VIC 3001",
    emergencyContact: "Robert Thompson",
    emergencyPhone: "0423876543",
    emergencyRelation: "Brother",
    ndisNumber: "4100000002",
    planStartDate: new Date("2024-02-01"),
    planEndDate: new Date("2024-12-31"),
    planBudget: 125000.0,
    planManager: "David Wilson",
    supportCoordinator: "Lisa Chen",
    disabilities: ["Down Syndrome", "Hearing Impairment"],
    medications: ["Thyroxine 50mcg", "Iron supplements"],
    allergies: ["Shellfish"],
    medicalNotes:
      "Uses hearing aids, requires sign language interpreter for complex discussions",
    supportNeeds: [
      "Communication Support",
      "Daily Living Skills",
      "Social Skills",
    ],
    communicationMethod: "Sign Language/Auslan",
    behavioralNotes: "Very friendly and outgoing, enjoys social activities",
    status: "ACTIVE" as const,
  },
  {
    firstName: "Michael",
    lastName: "Garcia",
    preferredName: "Mike",
    dateOfBirth: new Date("1978-11-08"),
    gender: "Male",
    email: "michael.garcia@example.com",
    phone: "0434567890",
    address: "789 Pine Road, Melbourne VIC 3002",
    emergencyContact: "Maria Garcia",
    emergencyPhone: "0434987654",
    emergencyRelation: "Sister",
    ndisNumber: "4100000003",
    planStartDate: new Date("2024-01-15"),
    planEndDate: new Date("2024-12-31"),
    planBudget: 95000.0,
    planManager: "Sarah Johnson",
    supportCoordinator: "James Lee",
    disabilities: ["Spinal Cord Injury", "Paraplegia"],
    medications: ["Gabapentin 300mg", "Baclofen 20mg"],
    allergies: ["Latex"],
    medicalNotes: "T12 complete SCI, uses wheelchair, catheterized",
    supportNeeds: ["Personal Care", "Equipment Maintenance", "Transportation"],
    communicationMethod: "Verbal",
    behavioralNotes: "Independent and determined, enjoys adaptive sports",
    status: "ACTIVE" as const,
  },
  {
    firstName: "Sarah",
    lastName: "Williams",
    preferredName: "Sarah",
    dateOfBirth: new Date("1995-05-30"),
    gender: "Female",
    email: "sarah.williams@example.com",
    phone: "0445678901",
    address: "321 Maple Lane, Melbourne VIC 3003",
    emergencyContact: "Peter Williams",
    emergencyPhone: "0445123456",
    emergencyRelation: "Father",
    ndisNumber: "4100000004",
    planStartDate: new Date("2024-03-01"),
    planEndDate: new Date("2024-12-31"),
    planBudget: 68000.0,
    planManager: "David Wilson",
    supportCoordinator: "Anna Patel",
    disabilities: ["Autism Spectrum Disorder"],
    medications: ["Melatonin 3mg (as needed)"],
    allergies: ["None known"],
    medicalNotes: "High-functioning ASD, sensory sensitivities",
    supportNeeds: ["Skill Development", "Employment Support", "Social Skills"],
    communicationMethod: "Verbal",
    behavioralNotes: "Structured routine important, excellent with technology",
    status: "ACTIVE" as const,
  },
  {
    firstName: "James",
    lastName: "Brown",
    preferredName: "Jimmy",
    dateOfBirth: new Date("1980-09-12"),
    gender: "Male",
    email: "james.brown@example.com",
    phone: "0456789012",
    address: "654 Cedar Court, Melbourne VIC 3004",
    emergencyContact: "Helen Brown",
    emergencyPhone: "0456234567",
    emergencyRelation: "Mother",
    ndisNumber: "4100000005",
    planStartDate: new Date("2024-01-01"),
    planEndDate: new Date("2024-12-31"),
    planBudget: 145000.0,
    planManager: "Sarah Johnson",
    supportCoordinator: "Mike Brown",
    disabilities: ["Multiple Sclerosis", "Mobility Impairment"],
    medications: ["Interferon beta-1a", "Pain medication"],
    allergies: ["Codeine"],
    medicalNotes:
      "Progressive MS, uses walking stick, fatigue management important",
    supportNeeds: ["Mobility Support", "Home Maintenance", "Respite Care"],
    communicationMethod: "Verbal",
    behavioralNotes:
      "Very knowledgeable about his condition, proactive in care",
    status: "ACTIVE" as const,
  },
];

export async function seedParticipants() {
  console.log("🚀 Starting participant seeding...");

  try {
    for (const participant of participantData) {
      await prisma.participant.upsert({
        where: { ndisNumber: participant.ndisNumber },
        update: participant,
        create: participant,
      });
      console.log(
        `✅ Created/Updated participant: ${participant.firstName} ${participant.lastName}`
      );
    }

    console.log(
      `🎉 Successfully seeded ${participantData.length} participants`
    );
  } catch (error) {
    console.error("❌ Error seeding participants:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
