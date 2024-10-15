import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id ? Number(event.context.params.id) : null;

  // ตรวจสอบว่า ID มีค่าเป็นตัวเลขหรือไม่
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid promotion ID',
    });
  }

  if (event.node.req.method === 'GET') {
    // ดำเนินการสำหรับการดึงข้อมูลโปรโมชั่น (GET)
    try {
      const promotion = await prisma.promotion.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!promotion) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Promotion not found',
        });
      }

      return promotion;
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      });
    }
  } else if (event.node.req.method === 'PUT') {
    // ดำเนินการสำหรับการอัปเดตโปรโมชั่น (PUT)
    try {
      const body = await readBody(event); // อ่านข้อมูลจาก request body
      const { name, startDate, endDate, imageUrl, status } = body;

      // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วนหรือไม่
      if (!name || !startDate || !endDate || !imageUrl || !status) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing required fields',
        });
      }

      // อัปเดตข้อมูลโปรโมชั่นในฐานข้อมูล
      const updatedPromotion = await prisma.promotion.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          imageUrl,
          status,
        },
      });

      return updatedPromotion;
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      });
    }
  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }
});
