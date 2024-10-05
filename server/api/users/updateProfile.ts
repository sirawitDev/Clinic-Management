import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Get request body
  const { userId, firstname, lastname, address } = body; // Destructure the required fields

  try {
    // Update user information
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstname,
        lastname,
      },
    });

    // Update or create address information
    const updatedAddress = await prisma.address.upsert({
      where: { userId }, // Assuming userId is unique for the address
      update: {
        country: address.country,
        houseNumber: address.houseNumber,
        village: address.village,
        subdistrict: address.subdistrict,
        district: address.district,
        province: address.province,
        postalCode: address.postalCode,
        phoneNumber: address.phoneNumber,
      },
      create: {
        userId,
        country: address.country,
        houseNumber: address.houseNumber,
        village: address.village,
        subdistrict: address.subdistrict,
        district: address.district,
        province: address.province,
        postalCode: address.postalCode,
        phoneNumber: address.phoneNumber,
      },
    });

    return { success: true, user, address: updatedAddress };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
});
