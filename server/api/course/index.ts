import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { method } = event.req;

  try {
    switch (method) {
      case 'GET':
        // Fetch all courses
        const courses = await prisma.course.findMany();
        return courses;

      case 'POST':
        // Create a new course
        const body = await readBody(event);
        const newCourse = await prisma.course.create({
          data: {
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            price: body.price,
          },
        });
        return newCourse;

      default:
        // Handle unsupported methods
        event.res.statusCode = 405;
        return { message: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error handling courses:', error);
    event.res.statusCode = 500; // Internal Server Error
    return { message: 'An error occurred', error: error.message };
  } finally {
    // Ensure Prisma Client is disconnected after each request
    await prisma.$disconnect();
  }
});
