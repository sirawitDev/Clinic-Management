import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // อ่านข้อมูลที่ส่งมา
  const { email } = body;

  try {
    const deletedUser = await prisma.user.delete({
      where: { email },
    });

    return { success: true, user: deletedUser };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete user' };
  }
});
