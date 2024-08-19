// server/api/physician/[id].ts
import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody, createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { method } = event.req;
  const id = event.context.params?.id ? Number(event.context.params.id) : null;

  try {
    switch (method) {
      case 'GET':
        if (id) {
          const physician = await prisma.physician.findUnique({
            where: { id },
          });
          if (!physician) {
            return createError({ statusCode: 404, statusMessage: 'Physician not found' });
          }
          return physician;
        } else {
          return await prisma.physician.findMany();
        }

      case 'POST':
        const newPhysicianData = await readBody(event);
        return await prisma.physician.create({ data: newPhysicianData });

      case 'PUT':
        if (!id) {
          return createError({ statusCode: 400, statusMessage: 'ID not provided' });
        }
        const updateData = await readBody(event);
        return await prisma.physician.update({
          where: { id },
          data: updateData,
        });

      case 'DELETE':
        if (!id) {
          return createError({ statusCode: 400, statusMessage: 'ID not provided' });
        }
        try {
          const deletedPhysician = await prisma.physician.delete({
            where: { id },
          });
          return deletedPhysician;
        } catch (error) {
          return createError({ statusCode: 500, statusMessage: 'Error deleting physician', details: error.message });
        }

      default:
        return createError({ statusCode: 405, statusMessage: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return createError({ statusCode: 500, statusMessage: 'Internal server error', details: error.message });
  }
});