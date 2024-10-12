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

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return {
    message: 'User registered successfully',
    user: newUser,
  };
});
