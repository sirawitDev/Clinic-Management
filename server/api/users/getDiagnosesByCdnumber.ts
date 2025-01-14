// server/api/getDiagnosesByCdnumber.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const cdnumber = query.cdnumber;

  if (!cdnumber) {
    throw createError({ statusCode: 400, message: 'cdnumber is required' });
  }

  try {
    const diagnoses = await prisma.diagnosis.findMany({
      where: {
        patient: {
          cdnumber: cdnumber,
        },
      },
      include: {
        patient: true,
        physician: true, 
      },
    });

    return diagnoses;
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch diagnoses' });
  }
});
