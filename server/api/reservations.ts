//server/api/reservations.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const method = event.req.method;
    
    if (method === 'GET') {
        // Handle GET request (fetch reservations)
        const query = getQuery(event);
        
        try {
            if (query.id) {
                // Fetch a specific reservation by ID
                const reservation = await prisma.reservation.findUnique({
                    where: { id: Number(query.id) },
                });

                if (reservation) {
                    return {
                        success: true,
                        reservation,
                    };
                } else {
                    return {
                        success: false,
                        message: 'Reservation not found',
                    };
                }
            } else {
                // Fetch all reservations
                const reservations = await prisma.reservation.findMany();
                return {
                    success: true,
                    reservations,
                };
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
            return {
                success: false,
                message: 'Failed to fetch reservations',
            };
        }
    }
    
    if (method === 'POST') {
        // Handle POST request (create a new reservation)
        const body = await readBody(event);

        try {
            const newReservation = await prisma.reservation.create({
                data: {
                    userId: body.userId,
                    firstname: body.firstname,
                    lastname: body.lastname,
                    cdnumber: body.cdnumber,
                    category: body.category,
                    date: new Date(body.date),
                    time: body.time,
                    note: body.note,
                    email: body.email
                },
            });

            return {
                success: true,
                reservation: newReservation,
            };
        } catch (error) {
            console.error('Error creating reservation:', error);
            return {
                success: false,
                message: 'Failed to create reservation',
            };
        }
    }
    
    if (method === 'DELETE') {
        // Handle DELETE request (delete a reservation)
        const query = getQuery(event);

        if (!query.id) {
          return {
            success: false,
            message: 'No reservation id provided',
          };
        }
        
        try {
            const deletedReservation = await prisma.reservation.delete({
                where: { id: Number(query.id) },
            });

            return {
                success: true,
                reservation: deletedReservation,
            };
        } catch (error) {
            console.error('Error deleting reservation:', error);
            return {
                success: false,
                message: 'Failed to delete reservation',
            };
        }
    }

    return {
        success: false,
        message: 'Method not allowed',
    };
});
