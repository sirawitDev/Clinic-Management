//server/api/users/[id].ts
import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const { id } = event.context.params; // Get the dynamic route parameter `id`

  try {
    if (!id) {
      setResponseStatus(event, 400);
      return { message: 'User ID is required' };
    }

    const userId = Number(id);

    if (method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        setResponseStatus(event, 404);
        return { message: 'User not found' };
      }

      return user;
    }

    // Handle PUT request: Update user data
    if (method === 'PUT') {
      const body = await readBody(event);

      if (!body) {
        setResponseStatus(event, 400);
        return { message: 'Request body is required for updating the user' };
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: body,
      });

      return { message: 'User updated successfully', data: updatedUser };
    }

    // Handle DELETE request: Remove the user by ID
    if (method === 'DELETE') {
      await prisma.user.delete({
        where: { id: userId },
      });

      setResponseStatus(event, 204);
      return { message: 'User deleted successfully' };
    }

    // If the method is not supported
    setResponseStatus(event, 405);
    return { message: 'Method Not Allowed' };
  } catch (error) {
    console.error('Error handling request:', error);
    setResponseStatus(event, 500);
    return { message: error.message };
  }
});
