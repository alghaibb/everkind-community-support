import { PrismaClient } from "@/generated/prisma";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "mahmoud.j@ekcs.com.au" },
    update: {
      name: "Mahmoud Jaderi",
      emailVerified: true,
      role: "ADMIN",
      image: null,
    },
    create: {
      id: nanoid(),
      name: "Mahmoud Jaderi",
      email: "mahmoud.j@ekcs.com.au",
      emailVerified: true,
      role: "ADMIN",
      image: null,
    },
  });

  console.log("✅ Admin user created:", {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role,
  });

  // Optionally, create some test data for the admin panel
  console.log("📝 Creating sample data...");

  // Create sample contact messages
  const contactMessages = await Promise.all([
    prisma.contactMessage.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "0412345678",
        subject: "Service Inquiry",
        message: "I would like to know more about your NDIS support services.",
      },
    }),
    prisma.contactMessage.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "0423456789",
        subject: "Career Opportunity",
        message: "I am interested in joining your team as a support worker.",
      },
    }),
  ]);

  console.log(`✅ Created ${contactMessages.length} sample contact messages`);

  // Create sample career submission
  await prisma.careerSubmission.create({
    data: {
      role: "Support Worker",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "0434567890",
      cert3IndividualSupport: "Yes",
      ahpraRegistration: null,
      covidVaccinations: "Yes",
      influenzaVaccination: "Yes",
      workingWithChildrenCheck: "Yes",
      ndisScreeningCheck: "Yes",
      policeCheck: "Yes",
      workingRights: "Yes",
      ndisModules: "Completed",
      firstAidCPR: "Current",
      experience: "3+ years",
      availability: {
        monday: { am: true, pm: true },
        tuesday: { am: true, pm: false },
        wednesday: { am: true, pm: true },
        thursday: { am: false, pm: true },
        friday: { am: true, pm: true },
        saturday: { am: false, pm: false },
        sunday: { am: false, pm: false },
      },
      resume: null,
      certificates: [],
    },
  });

  console.log("✅ Created sample career submission");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
