import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { method } = event.req;
  const { id } = event.context.params || {};

  try {
    switch (method) {
      case 'GET':
        const courses = await prisma.course.findMany();
        return courses;

      case 'POST':
        const body = await readBody(event);
        if (!body.title || !body.price) {
          event.res.statusCode = 400;
          return { message: 'Title and price are required' };
        }
        const newCourse = await prisma.course.create({
          data: {
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            price: body.price,
          },
        });
        return newCourse;

      case 'PUT':
        if (!id) {
          event.res.statusCode = 400;
          return { message: 'Course ID is required for update' };
        }
        const updateBody = await readBody(event);
        const updatedCourse = await prisma.course.update({
          where: { id: parseInt(id) },
          data: {
            title: updateBody.title,
            description: updateBody.description,
            imageUrl: updateBody.imageUrl,
            price: updateBody.price,
          },
        });
        return updatedCourse;

      case 'DELETE':
        if (!id) {
          event.res.statusCode = 400;
          return { message: 'Course ID is required for deletion' };
        }
        await prisma.course.delete({
          where: { id: parseInt(id) },
        });
        return { message: 'Course deleted successfully' };

      default:

        event.res.statusCode = 405; 
        return { message: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error handling course:', error);
    event.res.statusCode = 500;
    return { message: 'An error occurred', error: error.message };
  } finally {
    await prisma.$disconnect();
  }
});
