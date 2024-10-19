import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { courseId, patientIds } = body; // Accept multiple patientIds as an array

  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return { status: 'error', message: 'Course not found' };
    }

    // Iterate through patientIds and connect them to the course
    const promises = patientIds.map(async (id) => {
      const patient = await prisma.patients.findUnique({
        where: { id: parseInt(id) },
      });

      if (!patient) {
        return { status: 'error', message: `Patient with ID ${id} not found` };
      }

      // Check if the relationship already exists
      const existingRelationship = await prisma.patientCourse.findUnique({
        where: {
          patientId_courseId: {
            patientId: patient.id,
            courseId: course.id,
          },
        },
      });

      // Create the relationship if it does not exist
      if (!existingRelationship) {
        return prisma.patientCourse.create({
          data: {
            patientId: patient.id,
            courseId: course.id,
          },
        });
      }

      return null; // Relationship already exists
    });

    // Execute all promises
    await Promise.all(promises);

    // Fetch the updated course data to return
    const updatedCourse = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { patients: true }, // Include related patients if needed
    });

    return { status: 'success', course: updatedCourse };
  } catch (error) {
    console.error('Error adding patients to course:', error);
    return { status: 'error', message: error.message };
  } finally {
    await prisma.$disconnect();
  }
});
