import { PrismaClient } from '@prisma/client';
import { seedSubjects } from '../seed/seedSubjects';

const prisma = new PrismaClient();

async function main() {
  await seedSubjects();
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
