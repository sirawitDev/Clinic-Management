import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { patients: true }, // Include related patients
    });

    if (!course) {
      return { status: 'error', message: 'Course not found' };
    }

    return { course };
  } catch (error) {
    console.error('Error fetching course:', error);
    return { status: 'error', message: error.message };
  } finally {
    await prisma.$disconnect();
  }
});
