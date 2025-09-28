import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function addStaffAvailability() {
  console.log("🚀 Adding availability data to staff members...");

  try {
    // Get all staff members
    const staffMembers = await prisma.staff.findMany({
      include: {
        user: true,
      },
    });

    console.log(`📋 Found ${staffMembers.length} staff members`);

    // Sample availability patterns for different staff
    const availabilityPatterns = [
      // Full-time support worker - available weekdays AM/PM
      {
        monday: { am: true, pm: true },
        tuesday: { am: true, pm: true },
        wednesday: { am: true, pm: true },
        thursday: { am: true, pm: true },
        friday: { am: true, pm: true },
        saturday: { am: false, pm: false },
        sunday: { am: false, pm: false },
      },
      // Part-time nurse - weekdays AM only
      {
        monday: { am: true, pm: false },
        tuesday: { am: true, pm: false },
        wednesday: { am: true, pm: false },
        thursday: { am: true, pm: false },
        friday: { am: true, pm: false },
        saturday: { am: false, pm: false },
        sunday: { am: false, pm: false },
      },
      // Weekend nurse - weekends only
      {
        monday: { am: false, pm: false },
        tuesday: { am: false, pm: false },
        wednesday: { am: false, pm: false },
        thursday: { am: false, pm: false },
        friday: { am: false, pm: false },
        saturday: { am: true, pm: true },
        sunday: { am: true, pm: true },
      },
      // Coordinator - flexible schedule
      {
        monday: { am: true, pm: true },
        tuesday: { am: true, pm: true },
        wednesday: { am: false, pm: true },
        thursday: { am: true, pm: true },
        friday: { am: true, pm: true },
        saturday: { am: false, pm: false },
        sunday: { am: false, pm: false },
      },
    ];

    // Update each staff member with availability
    for (let i = 0; i < staffMembers.length; i++) {
      const staff = staffMembers[i];
      const availability =
        availabilityPatterns[i % availabilityPatterns.length];

      await prisma.staff.update({
        where: { id: staff.id },
        data: {
          availability,
        },
      });

      console.log(
        `✅ Updated ${staff.user.name} (${staff.staffRole}) with availability`
      );
    }

    console.log(
      "🎉 Successfully added availability data to all staff members!"
    );
    console.log(
      "📋 You can now view staff availability in the admin panel by clicking 'View Details' on any staff member."
    );
  } catch (error) {
    console.error("❌ Error adding staff availability:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addStaffAvailability();
