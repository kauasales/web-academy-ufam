import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const types = ['admin', 'common'];

  for (const name of types) {
    await prisma.userType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
