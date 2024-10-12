// api/admin/users
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { email } = getQuery(event); // รับ email จาก query parameters

  if (event.req.method === 'DELETE') {
    try {
      await prisma.user.delete({
        where: { email },
      });
      return { message: 'User deleted successfully' };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to delete user' };
    }
  }

  if (event.req.method === 'PUT') {
    try {
      const userData = await readBody(event); // รับข้อมูลที่ต้องการอัพเดท
      const updatedUser = await prisma.user.update({
        where: { email },
        data: userData,
      });
      return { message: 'User updated successfully', user: updatedUser };
    } catch (error) {
      console.error(error);
      return { error: 'Failed to update user' };
    }
  }

  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch users' };
  }
});
