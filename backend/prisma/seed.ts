import { PrismaClient } from '@prisma/client';
import { hashPassword } from './src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists, skipping creation');
    } else {
      // Create admin user
      const hashedPassword = await hashPassword('admin123');

      const adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@saungvibe.com',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      console.log('✓ Admin user created successfully');
      console.log('  Username: admin');
      console.log('  Password: admin123');
      console.log('  ⚠️  Remember to change password in production!');

      // Create admin settings
      await prisma.userSettings.create({
        data: {
          userId: adminUser.id,
          chatLimit: 100,
          currentChatCount: 0,
        },
      });

      console.log('✓ Admin settings created (chat limit: 100)');
    }

    console.log('✓ Database seed completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
