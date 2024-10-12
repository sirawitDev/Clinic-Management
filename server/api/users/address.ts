// /server/api/users/address.ts

import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getQuery, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.req.method;

  if (method === 'GET') {
    // Fetch all addresses for a user
    const query = getQuery(event);
    const userId = query.userId ? Number(query.userId) : null;
    const addressId = query.addressId ? Number(query.addressId) : null;
  
    if (userId) {
      try {
        if (addressId) {
          // Fetch specific address by ID
          const address = await prisma.address.findUnique({
            where: { id: addressId },
          });
  
          if (address) {
            return {
              success: true,
              address,
            };
          } else {
            return {
              success: false,
              message: 'Address not found',
            };
          }
        } else {
          // Fetch all addresses for the user
          const addresses = await prisma.address.findMany({
            where: {
              userId,
            },
          });
  
          return {
            success: true,
            addresses,
          };
        }
      } catch (error) {
        return {
          success: false,
          message: 'Failed to fetch addresses',
          error: error.message,
        };
      }
    } else {
      return {
        success: false,
        message: 'User ID is required',
      };
    }
  }
  

  if (method === 'POST') {
    // Create a new address
    const body = await readBody(event);
    const { userId, houseNumber, village, subdistrict, district, province, postalCode, phoneNumber, country } = body;

    if (!userId || !houseNumber || !subdistrict || !district || !province || !postalCode || !phoneNumber) {
      return {
        success: false,
        message: 'All fields are required',
      };
    }

    try {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          houseNumber,
          village,
          subdistrict,
          district,
          province,
          postalCode,
          phoneNumber,
          country,
        },
      });

      return {
        success: true,
        address: newAddress,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create address',
        error: error.message,
      };
    }
  }

  if (method === 'PUT') {
    // Update an existing address
    const body = await readBody(event);
    const { addressId, houseNumber, village, subdistrict, district, province, postalCode, phoneNumber, country } = body;

    if (!addressId || !houseNumber || !subdistrict || !district || !province || !postalCode || !phoneNumber) {
      return {
        success: false,
        message: 'All fields are required',
      };
    }

    try {
      const updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
          houseNumber,
          village,
          subdistrict,
          district,
          province,
          postalCode,
          phoneNumber,
          country,
        },
      });

      return {
        success: true,
        address: updatedAddress,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update address',
        error: error.message,
      };
    }
  }

  if (method === 'DELETE') {
    // Delete an address
    const query = getQuery(event);
    const addressId = query.addressId ? Number(query.addressId) : null;

    if (!addressId) {
      return {
        success: false,
        message: 'Address ID is required',
      };
    }

    try {
      await prisma.address.delete({
        where: { id: addressId },
      });

      return {
        success: true,
        message: 'Address deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete address',
        error: error.message,
      };
    }
  }

  return {
    success: false,
    message: 'Method not supported',
  };
});
