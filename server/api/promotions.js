import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { dirname } from 'path'

const prisma = new PrismaClient()

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.AWS_BUCKET;

const UPLOAD_DIR = 'public/uploads/promotions'

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating upload directory:', error)
    throw error
  }
}

export default defineEventHandler(async (event) => {
  const { method } = event.req;

  try {
    switch (method) {
      case 'POST': {
        const formData = await readMultipartFormData(event);
        if (!formData) throw new Error('No form data received');

        const imageFile = formData.find(item => item.name === 'image');
        const name = formData.find(item => item.name === 'name')?.data.toString();
        const about = formData.find(item => item.name === 'about')?.data.toString();
        const startDate = formData.find(item => item.name === 'startDate')?.data.toString();
        const endDate = formData.find(item => item.name === 'endDate')?.data.toString();
        const status = formData.find(item => item.name === 'status')?.data.toString();

        if (!imageFile || !imageFile.filename) throw new Error('No image file received');

        // Generate unique filename
        const fileExt = imageFile.filename.split('.').pop();
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `promotions/${uniqueFilename}`,
            Body: imageFile.data,
            ContentType: imageFile.type,
          })
        );

        // Save to database
        return await prisma.promotion.create({
          data: {
            name,
            imageUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/promotions/${uniqueFilename}`,
            about,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status,
          },
        });
      }

      case 'PUT': {
        const { id, ...updateData } = await readBody(event);
        if (!id) return { error: 'Promotion ID is required for update.' };
        return await prisma.promotion.update({
          where: { id },
          data: updateData,
        });
      }

      case 'DELETE': {
        const { id: deleteId } = await readBody(event);
        if (!deleteId) return { error: 'Promotion ID is required for deletion.' };

        // Get existing promotion to get file path
        const promotion = await prisma.promotion.findUnique({
          where: { id: deleteId },
        });

        if (promotion?.imageUrl) {
          // Extract the S3 key from the URL
          const key = promotion.imageUrl.split('.com/')[1];

          // Delete file from S3
          try {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
              })
            );
          } catch (error) {
            console.error('Error deleting file from S3:', error);
          }
        }

        await prisma.promotion.delete({ where: { id: deleteId } });
        return { success: true };
      }

      case 'GET':
        return await prisma.promotion.findMany();

      default:
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error in promotions handler:', error);
    return { error: error.message };
  }
});