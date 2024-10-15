// server/api/getDiagnosesByCdnumber.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);  // รับ query parameter จาก request
  const cdnumber = query.cdnumber;

  if (!cdnumber) {
    throw createError({ statusCode: 400, message: 'cdnumber is required' });
  }

  try {
    // ใช้ Prisma ในการดึงข้อมูลการวินิจฉัยของคนไข้ที่มี cdnumber ตรงกัน
    const diagnoses = await prisma.diagnosis.findMany({
      where: {
        patient: {
          cdnumber: cdnumber,  // กรองตาม cdnumber ของคนไข้
        },
      },
      include: {
        patient: true,  // ดึงข้อมูลคนไข้มาด้วย
        physician: true,  // ดึงข้อมูลแพทย์มาด้วย
      },
    });

    return diagnoses;
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch diagnoses' });
  }
});
