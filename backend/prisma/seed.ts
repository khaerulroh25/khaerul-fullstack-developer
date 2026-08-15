import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/seed/seedData.js';

const prisma = new PrismaClient();

async function main() {
  try {
    await seedDatabase(prisma);
  } catch (e) {
    console.error('❌ Gagal menjalankan seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
