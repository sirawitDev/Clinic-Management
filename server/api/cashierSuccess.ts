//server/api/cashierSuccess
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { diagnosisId , paymentStatus } = body;
  
  try {
    // Update user's cdnumber in the database
    const updatedSuccess = await prisma.diagnosis.update({
      where: { id: Number(diagnosisId) },
      data: { 
        paymentStatus: paymentStatus,
      },
    });

    // Return success response
    return {
      success: true,
      diagnosis: updatedSuccess,
    };
  } catch (error) {
    console.error('Error updating success:', error);
    return {
      success: false,
      error: 'Failed to update success',
    };
  }
});
