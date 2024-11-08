//server/api/payment.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    switch (method) {
      case 'POST': {
        const body = await readBody(event);
        console.log('Request Body:', body);

        const { orderNumber, totalAmount, diagnosisId } = body;

        // Validate request data
        if (!orderNumber || !totalAmount) {
          return { statusCode: 400, body: { message: 'Missing orderNumber or totalAmount' } };
        }

        // Create a new payment
        const payment = await prisma.payment.create({
          data: {
            orderNumber,
            totalAmount,
            diagnosisId,
            status: 'pending',
          },
        });

        return { statusCode: 200, body: payment };
      }

      case 'GET': {
        const query = getQuery(event);
        const { id } = query;

        if (id) {
          const payment = await prisma.payment.findUnique({
            where: { id: Number(id) },
            include: {
              diagnosis: {
                include: {
                  patient: true,
                },
              },
            },
          });

          if (!payment) {
            return { statusCode: 404, body: { message: 'Payment not found' } };
          }

          return { statusCode: 200, body: payment };
        }

        const payments = await prisma.payment.findMany({
          include: {
            diagnosis: {
              include: {
                patient: true,
              },
            },
          },
        });

        return { statusCode: 200, body: payments };
      }

      case 'PUT': {
        const body = await readBody(event);
        const { id, orderNumber, totalAmount, diagnosisId, status } = body;

        // Validate request
        if (!id || (!orderNumber && !totalAmount && !diagnosisId && !status)) {
          return { statusCode: 400, body: { message: 'Missing id or fields to update' } };
        }

        // Update the payment
        const updatedPayment = await prisma.payment.update({
          where: { id: Number(id) },
          data: { orderNumber, totalAmount, diagnosisId, status },
        });

        return { statusCode: 200, body: updatedPayment };
      }

      case 'DELETE': {
        const query = getQuery(event);
        const { id } = query;

        if (!id) {
          return { statusCode: 400, body: { message: 'Missing payment ID' } };
        }

        // Delete the payment
        await prisma.payment.delete({
          where: { id: Number(id) },
        });

        return { statusCode: 200, body: { message: 'Payment deleted successfully' } };
      }

      default:
        return { statusCode: 405, body: { message: 'Method Not Allowed' } };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return { statusCode: 500, body: { message: 'Internal Server Error' } };
  }
});
