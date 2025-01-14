// server/api/users/diagnosis/[cdnumber].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { uuid } = event.context.params; // Get the cdnumber from the URL parameter

  if (!cdnumber) {
    throw createError({ statusCode: 400, message: 'cdnumber is required' });
  }

  try {
    const diagnoses = await prisma.diagnosis.findMany({
      where: {
        patient: {
          cdnumber: cdnumber, // Filter by the patient’s cdnumber
        },
      },
      include: {
        patient: true, // Include patient information
        physician: true, // Include physician information
      },
    });

    return diagnoses;
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch diagnoses' });
  }
});
