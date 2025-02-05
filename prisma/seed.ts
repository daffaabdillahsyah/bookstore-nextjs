import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookstore.com' },
    update: {},
    create: {
      email: 'admin@bookstore.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@bookstore.com' },
    update: {},
    create: {
      email: 'user@bookstore.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create sample books
  const books = await prisma.book.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 9.99,
        description: 'A story of decadence and excess.',
        imageUrl: 'https://via.placeholder.com/400x600?text=The+Great+Gatsby',
      },
      {
        title: '1984',
        author: 'George Orwell',
        price: 12.99,
        description: 'A dystopian social science fiction.',
        imageUrl: 'https://via.placeholder.com/400x600?text=1984',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 14.99,
        description: 'A story of racial injustice and loss of innocence.',
        imageUrl: 'https://via.placeholder.com/400x600?text=To+Kill+a+Mockingbird',
      },
    ],
  });

  console.log({ admin, user, books });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 