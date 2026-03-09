import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@swrc.org";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hash,
      role: "ADMIN",
    },
  });

  console.log("Seed admin user:", user.email);

  // Optional: seed sample content (uncomment and run once if you want initial data)
  /*
  const pubCount = await prisma.publication.count();
  if (pubCount === 0) {
    await prisma.publication.createMany({
      data: [
        {
          title: "Annual Impact Report 2023",
          slug: "annual-impact-report-2023",
          type: "Annual Report",
          description: "Comprehensive overview of SWRC's achievements and program impacts.",
          year: 2023,
          pages: 56,
          fileSize: "2.4 MB",
          published: true,
        },
      ],
    });
    console.log("Seeded sample publication.");
  }
  */
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
