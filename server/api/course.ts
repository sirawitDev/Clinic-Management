import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { method } = event.req

  switch (method) {
    case 'GET':
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

    case 'PUT':
      // Update an existing course
      const updateBody = await readBody(event);
      const updatedCourse = await prisma.course.update({
        where: { id: updateBody.id },
        data: {
          title: updateBody.title,
          description: updateBody.description,
          imageUrl: updateBody.imageUrl,
          price: updateBody.price,
        },
      });
      return updatedCourse;

    case 'DELETE':
      // Delete a course
      const { id } = await readBody(event);
      await prisma.course.delete({
        where: { id },
      });
      return { message: 'Course deleted successfully' };

    default:
      // Handle unsupported methods
      event.res.statusCode = 405; // Method Not Allowed
      return { message: 'Method Not Allowed' };
  }
});
