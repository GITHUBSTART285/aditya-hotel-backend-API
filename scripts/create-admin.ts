
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@adityahotel.com";
  const password = "Tenets@12345";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      password: hashedPassword,
    },
    create: {
      name: "Hotel Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin account ready:", admin);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
