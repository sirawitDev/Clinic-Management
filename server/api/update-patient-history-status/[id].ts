// server/api/update-patient-history-status/[id].ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params;

    const diagnosisCount = await prisma.diagnosis.count({
      where: {
        patientHistoryId: parseInt(id, 10),
      },
    });
    const status = diagnosisCount > 0 ? 'open' : 'close';
    await prisma.patientHistory.update({
      where: { id: parseInt(id, 10) },
      data: { status: status },
    });

    return { message: 'Status updated successfully' };
  } catch (error) {
    console.error('Error updating status:', error);
    return { error: 'Internal server error' };
  }
});