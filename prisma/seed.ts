import { PrismaClient } from "@/generated/prisma";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";
import { seedParticipants } from "@/scripts/seed-participants";

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

  // Create admin account with password
  const adminPassword = "Admin123!"; // Default password for development
  try {
    await auth.api.signUpEmail({
      body: {
        email: "mahmoud.j@ekcs.com.au",
        password: adminPassword,
        name: adminUser.name,
      },
    });
    console.log("✅ Admin account created with password");
  } catch (error) {
    console.log(
      "ℹ️ Admin account may already exist, attempting to update password..."
    );

    // If account exists, we can't update password through API
    // Let's delete and recreate the account
    try {
      await prisma.account.deleteMany({
        where: { userId: adminUser.id },
      });

      await auth.api.signUpEmail({
        body: {
          email: "mahmoud.j@ekcs.com.au",
          password: adminPassword,
          name: adminUser.name,
        },
      });
      console.log("✅ Admin account password updated");
    } catch (retryError) {
      console.log("⚠️ Could not update admin account password");
    }
  }

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
  await prisma.careerSubmission.upsert({
    where: { email: "sarah.johnson.career@example.com" },
    update: {},
    create: {
      role: "Support Worker",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson.career@example.com",
      phone: "0456789012",
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
      wwccDocument: null,
      ndisDocument: null,
      policeCheckDocument: null,
      firstAidCertificate: null,
      qualificationCertificate: null,
      ahpraCertificate: null,
    },
  });

  console.log("✅ Created sample career submission");

  // Create sample staff members
  const staffUsers = await Promise.all([
    // Support Worker
    prisma.user.upsert({
      where: { email: "sarah.wilson@test.com" },
      update: {
        name: "Sarah Wilson",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
      create: {
        id: nanoid(),
        name: "Sarah Wilson",
        email: "sarah.wilson@test.com",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
    }),
    // Enrolled Nurse
    prisma.user.upsert({
      where: { email: "michael.chen@test.com" },
      update: {
        name: "Michael Chen",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
      create: {
        id: nanoid(),
        name: "Michael Chen",
        email: "michael.chen@test.com",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
    }),
    // Registered Nurse
    prisma.user.upsert({
      where: { email: "emma.davis@test.com" },
      update: {
        name: "Emma Davis",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
      create: {
        id: nanoid(),
        name: "Emma Davis",
        email: "emma.davis@test.com",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
    }),
    // Coordinator
    prisma.user.upsert({
      where: { email: "david.brown@test.com" },
      update: {
        name: "David Brown",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
      create: {
        id: nanoid(),
        name: "David Brown",
        email: "david.brown@test.com",
        emailVerified: true,
        role: "STAFF",
        userType: "INTERNAL",
      },
    }),
  ]);

  console.log(`✅ Created ${staffUsers.length} staff users`);

  // Create staff profiles
  const staffProfiles = await Promise.all([
    prisma.staff.upsert({
      where: { userId: staffUsers[0].id },
      update: {
        staffRole: "SUPPORT_WORKER",
        employeeId: "SW001",
        startDate: new Date("2023-01-15"),
        phone: "0412345678",
        emergencyContact: "John Wilson",
        emergencyPhone: "0412987654",
        address: "123 Main Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
        ],
        hourlyRate: 45.5,
        isActive: true,
      },
      create: {
        userId: staffUsers[0].id,
        staffRole: "SUPPORT_WORKER",
        employeeId: "SW001",
        startDate: new Date("2023-01-15"),
        phone: "0412345678",
        emergencyContact: "John Wilson",
        emergencyPhone: "0412987654",
        address: "123 Main Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
        ],
        hourlyRate: 45.5,
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { userId: staffUsers[1].id },
      update: {
        staffRole: "ENROLLED_NURSE",
        employeeId: "EN002",
        startDate: new Date("2022-08-10"),
        phone: "0423456789",
        emergencyContact: "Lisa Chen",
        emergencyPhone: "0423876543",
        address: "456 Queen Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        ahpraRegistration: "NMW1234567890",
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
          "Module 6: Behaviour Support",
          "Module 7: Health and Safety",
        ],
        hourlyRate: 55.75,
        isActive: true,
      },
      create: {
        userId: staffUsers[1].id,
        staffRole: "ENROLLED_NURSE",
        employeeId: "EN002",
        startDate: new Date("2022-08-10"),
        phone: "0423456789",
        emergencyContact: "Lisa Chen",
        emergencyPhone: "0423876543",
        address: "456 Queen Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        ahpraRegistration: "NMW1234567890",
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
          "Module 6: Behaviour Support",
          "Module 7: Health and Safety",
        ],
        hourlyRate: 55.75,
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { userId: staffUsers[2].id },
      update: {
        staffRole: "REGISTERED_NURSE",
        employeeId: "RN003",
        startDate: new Date("2021-03-20"),
        phone: "0434567890",
        emergencyContact: "Robert Davis",
        emergencyPhone: "0434765432",
        address: "789 Collins Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        ahpraRegistration: "NMW2345678901",
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
          "Module 6: Behaviour Support",
          "Module 7: Health and Safety",
        ],
        hourlyRate: 65.0,
        isActive: true,
      },
      create: {
        userId: staffUsers[2].id,
        staffRole: "REGISTERED_NURSE",
        employeeId: "RN003",
        startDate: new Date("2021-03-20"),
        phone: "0434567890",
        emergencyContact: "Robert Davis",
        emergencyPhone: "0434765432",
        address: "789 Collins Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        ahpraRegistration: "NMW2345678901",
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
          "Module 6: Behaviour Support",
          "Module 7: Health and Safety",
        ],
        hourlyRate: 65.0,
        isActive: true,
      },
    }),
    prisma.staff.upsert({
      where: { userId: staffUsers[3].id },
      update: {
        staffRole: "COORDINATOR",
        employeeId: "CO004",
        startDate: new Date("2020-11-01"),
        endDate: null,
        phone: "0445678901",
        emergencyContact: "Mary Brown",
        emergencyPhone: "0445654321",
        address: "321 Bourke Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
          "Module 6: Behaviour Support",
          "Module 7: Health and Safety",
        ],
        hourlyRate: 75.25,
        isActive: true,
      },
      create: {
        userId: staffUsers[3].id,
        staffRole: "COORDINATOR",
        employeeId: "CO004",
        startDate: new Date("2020-11-01"),
        endDate: null,
        phone: "0445678901",
        emergencyContact: "Mary Brown",
        emergencyPhone: "0445654321",
        address: "321 Bourke Street, Melbourne VIC 3000",
        cert3IndividualSupport: true,
        covidVaccinations: true,
        influenzaVaccination: true,
        workingWithChildrenCheck: true,
        ndisScreeningCheck: true,
        policeCheck: true,
        firstAidCPR: true,
        workingRights: true,
        ndisModules: [
          "Module 1: Understanding Disability",
          "Module 2: Communication",
          "Module 3: Legal and Ethical",
          "Module 4: Service Planning",
          "Module 5: Daily Living Skills",
          "Module 6: Behaviour Support",
          "Module 7: Health and Safety",
        ],
        hourlyRate: 75.25,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${staffProfiles.length} staff profiles`);

  // Create accounts for staff users
  for (const staffUser of staffUsers) {
    const staffPassword = "Staff123!"; // Default password for development
    try {
      await auth.api.signUpEmail({
        body: {
          email: staffUser.email,
          password: staffPassword,
          name: staffUser.name,
        },
      });
      console.log(`✅ Account created for ${staffUser.email}`);
    } catch (error) {
      console.log(
        `ℹ️ Account for ${staffUser.email} may already exist, attempting to update password...`
      );

      // If account exists, delete and recreate
      try {
        await prisma.account.deleteMany({
          where: { userId: staffUser.id },
        });

        await auth.api.signUpEmail({
          body: {
            email: staffUser.email,
            password: staffPassword,
            name: staffUser.name,
          },
        });
        console.log(`✅ Account password updated for ${staffUser.email}`);
      } catch (retryError) {
        console.log(
          `⚠️ Could not update account password for ${staffUser.email}`
        );
      }
    }
  }

  // Seed participants
  console.log("👥 Seeding participants...");
  await seedParticipants();

  console.log("🎉 Seed completed successfully!");
  console.log("📋 Login Credentials:");

  console.log("   Admin: mahmoud.j@ekcs.com.au / Admin123!");
  console.log("   Staff: [see emails above] / Staff123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
