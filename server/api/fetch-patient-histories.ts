// server/api/fetch-patient-histories.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
    try {
        const patientHistories = await prisma.patientHistory.findMany({
            include: {
                patient: true, // If you need patient details as well
            },
        });
        return patientHistories;
    } catch (error) {
        return { error: 'Error fetching patient histories' };
    }
});