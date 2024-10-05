// /api/addresses.js
import { defineEventHandler, readBody } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Ensure you're reading the request body
  const { userId, country, houseNumber, village, district, province, postalCode, phoneNumber,subdistrict } = body;

  if (!userId) {
    return { success: false, message: 'User ID is required.' };
  }

  try {
    const newAddress = await prisma.address.create({
      data: {
        userId,
        country,
        houseNumber,
        village,
        district,
        province,
        postalCode,
        phoneNumber,
        subdistrict,
      },
    });

    return { success: true, address: newAddress };
  } catch (error) {
    console.error('Error creating address:', error);
    return { success: false, message: 'Error creating address.' };
  }
});
