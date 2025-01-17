import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    switch (method) {
      case 'POST': {
        const body = await readBody(event);
        console.log('Request Body:', body);

        const { products, orderNumber, totalAmount, diagnosisId, quantity, paymentMethod } = body;

        if (!orderNumber || !totalAmount) {
          return { statusCode: 400, body: { message: 'Missing orderNumber or totalAmount' } };
        }

        try {
          const payment = await prisma.payment.create({
            data: {
              orderNumber,
              products: products ? { set: products } : null,
              totalAmount,
              diagnosisId,
              quantity: quantity || (products?.reduce((sum, product) => sum + product.quantity, 0) ?? 0),
              paymentMethod: paymentMethod || null,
              status: 'pending',
            },
          });
          console.log('Payment Creation Result:', payment);
          return { statusCode: 200, body: JSON.stringify(payment) };
        } catch (error) {
          console.error('Error creating payment:', error);
          return { statusCode: 500, body: { message: 'Internal Server Error', error: error.message } };
        }
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
    console.error('Error handling request:', error); // Log error details
    return { statusCode: 500, body: { message: 'Internal Server Error' } };
  }
});
