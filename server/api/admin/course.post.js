import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/course'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname); 
  },
});

const upload = multer({ storage });

export default defineEventHandler(async (event) => {
  try {
    // Use multer to handle file upload
    const uploadHandler = upload.single('image');
    await new Promise((resolve, reject) => {
      uploadHandler(event.req, event.res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Extract data from the request
    const { title, description, price } = event.req.body;
    const imageUrl = event.req.file ? `/uploads/course/${event.req.file.filename}` : null;

    // Validate required fields
    if (!title || !price) {
      event.res.statusCode = 400;
      return { message: 'Title and price are required' };
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl,
        price: parseFloat(price),
      },
    });

    return newCourse;
  } catch (error) {
    console.error('Error creating course:', error);
    event.res.statusCode = 500;
    return { message: 'An error occurred', error: error.message };
  } finally {
    await prisma.$disconnect();
  }
});
