//server/api/users/profile.post.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, firstname, lastname, address } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { email, firstname, lastname },
    });

    if (address) {
      const updatedAddress = await prisma.address.upsert({
        where: { userId: updatedUser.id },
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
          userId: updatedUser.id,
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

      console.log('Updated address:', updatedAddress);
    }

    console.log('Updated user:', updatedUser);
    return { user: updatedUser, success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update profile',
      data: error,
    });
  }
});
