
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!body.products || !body.orderNumber || !body.totalAmount || !body.paymentMethod) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }

    const newPayment = await prisma.payment.create({
      data: {
        orderNumber: body.orderNumber,
        products: body.products,
        totalAmount: body.totalAmount,
        quantity: body.quantity || 0,
        paymentMethod: body.paymentMethod,
        status: 'pending',
        diagnosisId: body.diagnosisId || null,
      },
    });

    return {
      success: true,
      payment: newPayment,
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error',
    });
  }
});
