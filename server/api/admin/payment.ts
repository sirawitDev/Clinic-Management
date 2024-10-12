import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.req.method;

  if (method === 'GET') {
    // Fetch all payments
    const payments = await prisma.payment.findMany({
      include: {
        diagnosis: {
          include: {
            patient: true
          }
        }
      }
    });
    return { body: payments };
  }

  if (method === 'DELETE') {
    const { id } = event.context.params;

    try {
      // Delete the payment with the given ID
      const deletedPayment = await prisma.payment.delete({
        where: { id: Number(id) }
      });

      return {
        body: { message: 'Payment deleted successfully', payment: deletedPayment }
      };
    } catch (error) {
      return { body: { message: 'Error deleting payment', error } };
    }
  }
});
