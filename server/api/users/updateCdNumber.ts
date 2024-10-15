import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Get request body
  const { userId, cdnumber } = body; // Destructure the required fields
  
  try {
    // Update user's cdnumber in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        cdnumber,
      },
    });

    // Return success response
    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error updating cdnumber:', error);
    return {
      success: false,
      error: 'Failed to update cdnumber',
    };
  }
});
