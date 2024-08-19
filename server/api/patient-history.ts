// server/api/patient-history.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const patientHistory = await prisma.patientHistory.create({
      data: {
        patientId: body.patientId,
        weight: body.weight,
        height: body.height,
        temperature: body.temperature,
        bloodPressure: body.bloodPressure,
        pulse: body.pulse,
        respiration: body.respiration,
        chiefComplaint: body.chiefComplaint,
        symptoms: body.symptoms,
        physicalExam: body.physicalExam,
      },
    });
    return patientHistory;
  } catch (error) {
    return { error: 'Error creating patient history' };
  }
});