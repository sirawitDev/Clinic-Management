// server/api/patientHistory.ts
import { PrismaClient } from '@prisma/client';
import { eventHandler } from 'h3';

const prisma = new PrismaClient();

export default eventHandler(async (event) => {
  if (event.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const {
        patientId,
        weight,
        height,
        temperature,
        bloodPressure,
        pulse,
        respiration,
        chiefComplaint,
        symptoms,
        physicalExam
      } = body;

      const newHistory = await prisma.patientHistory.create({
        data: {
          patientId,
          weight,
          height,
          temperature,
          bloodPressure,
          pulse,
          respiration,
          chiefComplaint,
          symptoms,
          physicalExam
        }
      });

      return newHistory;
    } catch (error) {
      console.error('Error creating patient history:', error);
      throw new Error('Failed to create patient history');
    }
  } else {
    throw new Error(`Method ${event.req.method} Not Allowed`);
  }
});