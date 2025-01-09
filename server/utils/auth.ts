// /server/utils/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key';

export const getUserFromToken = async (event) => {
  const authHeader = event.node.req.headers['authorization'];
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
