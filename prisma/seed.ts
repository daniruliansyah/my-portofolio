import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@portofolio.com";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("Admin user already exists, skipping.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
    },
  });

  console.log(`Admin user created: ${user.email}`);
  console.log("Email   : admin@portofolio.com");
  console.log("Password: admin123  <- ganti segera setelah login pertama!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
