// server/api/delete-patient-history.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  
  try {
    const deletedPatientHistory = await prisma.patientHistory.delete({
      where: { id },
    });
    return deletedPatientHistory;
  } catch (error) {
    return { error: 'Error deleting patient history' };
  }
});