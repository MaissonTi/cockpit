import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();

  const passwordHash = await hash('123456', 1);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: passwordHash,
    },
  });

  const promise = [];

  Array.from({ length: 30 }).map(async () => {
    promise.push(
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: passwordHash,
        },
      }),
    );
  });

  await Promise.all(promise);
}

seed().then(() => {
  console.log('Seed completed');
  prisma.$disconnect();
});
