// server/api/users.ts
import { defineEventHandler, getQuery, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);
  
  try {
    if (method === 'GET') {
      if (query.id) {
        const user = await prisma.user.findUnique({
          where: { id: Number(query.id) },
        });
        if (!user) {
          return { statusCode: 404, message: 'User not found' };
        }
        return user;
      } else {
        const users = await prisma.user.findMany();
        return users;
      }
    }

    if (method === 'POST') {
      // POST: สร้างผู้ใช้ใหม่
      const body = await readBody(event);
      const newUser = await prisma.user.create({
        data: body,
      });
      return { statusCode: 201, data: newUser };
    }

    if (method === 'PUT') {
      // PUT: อัปเดตข้อมูลผู้ใช้
      const body = await readBody(event);
      if (!query.id) {
        return { statusCode: 400, message: 'User ID is required' };
      }
      const updatedUser = await prisma.user.update({
        where: { id: Number(query.id) },
        data: body,
      });
      return { statusCode: 200, data: updatedUser };
    }

    if (method === 'DELETE') {
      // DELETE: ลบผู้ใช้
      if (!query.id) {
        return { statusCode: 400, message: 'User ID is required' };
      }
      await prisma.user.delete({
        where: { id: Number(query.id) },
      });
      return { statusCode: 204, message: 'User deleted' };
    }

    return { statusCode: 405, message: 'Method Not Allowed' };
  } catch (error) {
    return { statusCode: 500, message: error.message };
  }
});
