import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { method } = event.req;

  try {
    switch (method) {
      case 'POST':
        const body = await readBody(event);
        return await prisma.periodOfdrug.create({
          data: {
            ...body,
          },
        });

      case 'PUT':
        const { id, ...updateData } = await readBody(event);
        if (!id) return { error: 'Period ID is required for update.' };
        return await prisma.periodOfdrug.update({
          where: { id },
          data: updateData,
        });

      case 'DELETE': {
        const query = getQuery(event);  // Extract query parameters
        const id = query.id;  // Get the 'id' from the query
        if (!id) return { error: 'Period ID is required for deletion.' };
        
        // Ensure id is converted to a number, as Prisma expects a numeric ID
        await prisma.periodOfdrug.delete({ where: { id: Number(id) } });
        return { success: true };
      }

      case 'GET':
        return await prisma.periodOfdrug.findMany();

      default:
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error in periodOfdrug handler:', error);
    return { error: error.message };
  }
});

