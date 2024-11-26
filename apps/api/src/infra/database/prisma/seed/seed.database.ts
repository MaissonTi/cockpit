import { UserRoleEnum } from '@/domain/enum/user-roles.enum';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();

  const passwordHash = await hash('123456', 1);

  await prisma.user.create({
    data: {
      id: 'ff0eccc0-425b-42a5-9f1c-02a996968606',
      name: 'Admin',
      email: 'admin@gmail.com',
      password: passwordHash,
      role: UserRoleEnum.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      id: '8349f2e7-de94-43af-8607-9046645954a8',
      name: 'Lord',
      email: 'lord@gmail.com',
      password: passwordHash,
      role: UserRoleEnum.COMMON,
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

  await seedProcess();
}

async function seedProcess() {
  const promise = [];

  Array.from({ length: 3 }).map(async () => {
    promise.push(
      prisma.processDispute.create({
        data: {
          name: faker.music.album(),
          batch: {
            createMany: {
              data: Array.from({ length: 3 }).map(() => ({
                name: faker.music.genre(),
              })),
            },
          },
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
