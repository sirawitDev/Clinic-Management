import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  switch (event.node.req.method) {
    case 'GET': {
      const patient = await prisma.patients.findUnique({
        where: { id: parseInt(id, 10) },
        // include: {
        //   patientHistories: true,
        //   diagnoses: true,
        //   courses: true,
        // },
      });

      if (!patient) {
        return { statusCode: 404, message: 'Patient not found' };
      }

      return patient;
    }

    case 'PUT': {
      // Update patient details
      const body = await readBody(event);
      try {
        const updatedPatient = await prisma.patients.update({
          where: { id: parseInt(id, 10) },
          data: body,
        });

        return updatedPatient;
      } catch (error) {
        return { statusCode: 400, message: 'Update failed', error };
      }
    }

    case 'DELETE': {
      // Delete patient record
      try {
        await prisma.patients.delete({
          where: { id: parseInt(id, 10) },
        });

        return { statusCode: 200, message: 'Patient deleted successfully' };
      } catch (error) {
        return { statusCode: 400, message: 'Deletion failed', error };
      }
    }

    default:
      return { statusCode: 405, message: 'Method Not Allowed' };
  }
});
