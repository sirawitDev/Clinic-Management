import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { method } = event.req;

  try {
    switch (method) {
      case 'POST':
        const body = await readBody(event);
        return await prisma.promotion.create({
          data: {
            ...body, 
            startDate: new Date(body.startDate),  
            endDate: new Date(body.endDate),
          },
        });

      case 'PUT':
        const { id, ...updateData } = await readBody(event);
        if (!id) return { error: 'Promotion ID is required for update.' };
        return await prisma.promotion.update({
          where: { id },
          data: updateData,
        });

      case 'DELETE':
        const { id: deleteId } = await readBody(event);
        if (!deleteId) return { error: 'Promotion ID is required for deletion.' };
        await prisma.promotion.delete({ where: { id: deleteId } });
        return { success: true };

      case 'GET':
        return await prisma.promotion.findMany();

      default:
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error in promotions handler:', error);
    return { error: error.message };
  }
});
