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
          const drug = await prisma.drug.findUnique({
            where: { id },
          });
          if (!drug) {
            return createError({ statusCode: 404, statusMessage: 'Drug not found' });
          }
          return drug;
        } else {
          return await prisma.drug.findMany();
        }

      case 'POST':
        const newDrugData = await readBody(event);
        return await prisma.drug.create({ data: newDrugData });

      case 'PUT':
        if (!id) {
          return createError({ statusCode: 400, statusMessage: 'ID not provided' });
        }
        const updateData = await readBody(event);
        return await prisma.drug.update({
          where: { id },
          data: updateData,
        });

      case 'DELETE':
        if (!id) {
          return createError({ statusCode: 400, statusMessage: 'ID not provided' });
        }
        try {
          const deletedDrug = await prisma.drug.delete({
            where: { id },
          });
          return deletedDrug;
        } catch (error) {
          return createError({ statusCode: 500, statusMessage: 'Error deleting drug', details: error.message });
        }

      default:
        return createError({ statusCode: 405, statusMessage: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return createError({ statusCode: 500, statusMessage: 'Internal server error', details: error.message });
  }
});
