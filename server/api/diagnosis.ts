import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.req.method;

  try {
    if (method === 'POST') {
      const body = await readBody(event);
      const { patient_id, patientHistoryId, diagnosis, treatment_plan, notes, physician_id } = body;

      if (!patient_id || !physician_id || !diagnosis) {
        return { statusCode: 400, body: { error: 'Missing required fields' } };
      }

      const physician = await prisma.physician.findUnique({ where: { id: physician_id } });
      if (!physician) {
        return { statusCode: 404, body: { error: 'Physician not found' } };
      }

      const newDiagnosis = await prisma.diagnosis.create({
        data: { patient_id, diagnosis, treatment_plan, notes, physician_id, patientHistoryId },
      });

      return { statusCode: 201, body: newDiagnosis };
    } 

    if (method === 'GET') {
      return await prisma.diagnosis.findMany();
    } 

    if (method === 'DELETE') {
      const { id: deleteId } = await readBody(event)
      return await prisma.diagnosis.delete({ where: { id: deleteId } })
    }

    return { statusCode: 405, body: { error: 'Method Not Allowed' } };

  } catch (error) {
    console.error('API error:', error);
    return { statusCode: 500, body: { error: 'Internal Server Error' } };
  }
});