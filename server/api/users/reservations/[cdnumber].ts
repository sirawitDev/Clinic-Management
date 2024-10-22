import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { cdnumber } = event.context.params; // Get cdnumber from the route

    try {
        // Find reservations by cdnumber
        const reservations = await prisma.reservation.findMany({
            where: { cdnumber: cdnumber },
        });

        if (reservations.length > 0) {
            return {
                success: true,
                reservations,
            };
        } else {
            return {
                success: false,
                message: 'No reservations found for the provided cdnumber',
            };
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return {
            success: false,
            message: 'Failed to fetch reservations',
        };
    }
});
