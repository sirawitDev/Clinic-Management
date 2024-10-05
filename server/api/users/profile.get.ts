//server/api/users/profile.get.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { id } = query;

  const user = await prisma.user.findUnique({
    where: { id }, // Find user by email
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  return { user };
});
