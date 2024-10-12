import { defineEventHandler, getQuery, setResponseStatus } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = Number(query.id); // Get ID from query

  try {
    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      setResponseStatus(event, 404); // Set 404 status
      return { message: 'User not found' }; // Return error message
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    setResponseStatus(event, 204); // Set status to 204 No Content
    return {}; // No content response
  } catch (error) {
    setResponseStatus(event, 500); // Set status to 500 on error
    return { message: error.message }; // Return error message
  }
});
