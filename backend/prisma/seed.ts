import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const testUsers = [
  {
    email: "test@example.com",
    password: "password123",
  },
  {
    email: "demo@example.com",
    password: "demo1234",
  },
  {
    email: "admin@example.com",
    password: "admin123",
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  for (const { email, password } of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`⏭️  User already exists: ${email}`);
        continue;
      }

      // Hash password and create user
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
        },
      });

      console.log(`✅ Created user: ${email}`);
      console.log(`   Password: ${password}`);
    } catch (error) {
      console.error(`❌ Error creating user ${email}:`, error);
    }
  }

  console.log("\n✨ Seed completed!");
  console.log("\n📝 Test Credentials:");
  testUsers.forEach(({ email, password }) => {
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("");
  });
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
