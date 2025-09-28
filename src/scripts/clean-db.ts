// This script is to only be used in development
// It drops all data from the database in the correct order (respecting foreign key constraints)

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Starting database cleanup...");

  try {
    // Delete in order of dependencies (child tables first, then parent tables)

    // Service records (depends on participants and staff)
    await prisma.serviceRecord.deleteMany();
    console.log("✅ Deleted service records");

    // Participant relationships
    await prisma.participantFamily.deleteMany();
    await prisma.participantStaff.deleteMany();
    console.log("✅ Deleted participant relationships");

    // Main entities (keep users)
    await prisma.participant.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.familyMember.deleteMany();
    console.log("✅ Deleted participants, staff, and family members");

    // Career and contact data
    await prisma.careerSubmission.deleteMany();
    await prisma.contactMessage.deleteMany();
    console.log("✅ Deleted career submissions and contact messages");

    // User-related tables (keep users)
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verification.deleteMany();
    console.log("✅ Deleted sessions, accounts, and verifications");

    console.log("✅ Preserved user accounts");

    console.log("🎉 Database cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Error during database cleanup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
