import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { courseId, patientId } = await readBody(event); // Get courseId and patientId from the request body

  try {
    // Disconnect the patient from the course
    await prisma.patientCourse.delete({
      where: {
        patientId_courseId: {
          patientId: Number(patientId), // Ensure the patient ID is a number
          courseId: Number(courseId),   // Ensure the course ID is a number
        },
      },
    });

    return {
      success: true,
      message: 'Patient removed from course successfully',
    };
  } catch (error) {
    console.error('Error removing patient from course:', error);
    return {
      success: false,
      message: 'Error removing patient from course',
    };
  }
});
