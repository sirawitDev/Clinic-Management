import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, currentPassword, newPassword } = body;

  // Fetch the user by ID
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: 'User not found' };
  }

  // Check if the current password is correct
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return { error: 'Incorrect current password' };
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
});
