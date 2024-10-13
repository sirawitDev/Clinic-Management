// server/api/auth/google-login.post.ts

import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

import jwt from 'jsonwebtoken';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(googleClientId);
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const token = body.token;

    if (!token) {
      return {
        error: 'Token is missing',
      };
    }

    // Verify the Google token
    const userPayload = await verify(token);

    if (!userPayload || !userPayload.email) {
      throw createError({
        statusCode: 400,
        message: 'Invalid Google user data',
      });
    }

    const { email, given_name: firstName, family_name: lastName } = userPayload;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstname: firstName,
          lastname: lastName,
          role: 'user', // Assign default role
          // Google login users may not need passwords, but this can be changed if needed
        },
      });
    }

    const tokenJwt = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    return {
      message: 'Google login successful',
      tokenJwt,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Error during Google login:', error);
    return {
      error: 'Google login failed',
    };
  }
});

async function verify(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error('Error verifying the token: ' + error.message);
  }
}
