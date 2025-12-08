import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Seeds the "Physics" subject only.
 * Safe to run repeatedly (via upsert).
 */
export async function seedSubjects() {
  console.log('🌱 Seeding subjects...');

  const physics = await prisma.subject.upsert({
    where: { slug: 'physics' },
    update: {
      title: 'Physics',
      summary:
        'The study of matter, energy, and the fundamental rules of the universe.',
    },
    create: {
      slug: 'physics',
      title: 'Physics',
      summary:
        'The study of matter, energy, and the fundamental rules of the universe.',
      order: 1,
    },
  });

  console.log(`✅ Physics subject ready (id: ${physics.id})`);
}
