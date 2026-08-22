require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedLabTechnician() {
  console.log('Seeding LAB_TECHNICIAN demo account without deleting any existing data...');
  
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'lab.tech@w2w.test' },
    update: {
      name: 'Petugas Uji Lab (Lab Tech)',
      role: 'LAB_TECHNICIAN',
    },
    create: {
      name: 'Petugas Uji Lab (Lab Tech)',
      email: 'lab.tech@w2w.test',
      passwordHash,
      role: 'LAB_TECHNICIAN',
      phone: '081234567899',
    },
  });

  console.log('✅ Account LAB_TECHNICIAN successfully created/updated:');
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: password123`);
  console.log(`   Role: ${user.role}`);
}

seedLabTechnician()
  .catch((e) => {
    console.error('❌ Error seeding lab tech:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
