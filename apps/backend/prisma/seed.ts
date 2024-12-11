import _ from 'lodash';
import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

(async () => {
  const users: Array<Promise<User>> = [];
  _.times(20000, () => {
    const email = faker.internet.email();
    users.push(
      prisma.user.upsert({
        where: { email },
        create: {
          email,
          name: faker.person.firstName(),
          posts: {
            create: { title: faker.lorem.sentence() },
          },
          profile: {
            create: { bio: faker.lorem.sentence() },
          },
        },
        update: {},
      })
    );
  });

  await Promise.all(users);
})();
