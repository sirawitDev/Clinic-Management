import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key'; // Replace with env variable

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Invalid credentials' };
  }

  // Compare the password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { error: 'Invalid credentials' };
  }

  // Create a JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  return { success: true, token, user };
});
