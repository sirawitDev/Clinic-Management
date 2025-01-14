//server/api/auth/register.post.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { email, password, confirmPassword } = await readBody(event);

  // Check if passwords match
  if (password !== confirmPassword) {
    throw createError({
      statusCode: 400,
      message: 'Passwords do not match.',
    });
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'User already exists.',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const lastUser = await prisma.user.findFirst({
    orderBy: { id: 'desc' },
  });

  let newUuid = 'M0001';
  if (lastUser) {
    const lastUuidNumber = parseInt(lastUser.uuid.substring(1), 10);
    newUuid = `M${String(lastUuidNumber + 1).padStart(4, '0')}`;
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      uuid: newUuid,
    },
  });

  return {
    message: 'User registered successfully',
    user: newUser,
  };
});
