import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prevent creating many clients during hot reload in dev
export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    // log: ['query', 'error', 'warn'], // optional
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
