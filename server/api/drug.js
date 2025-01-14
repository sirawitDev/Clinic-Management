import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

const createUploadsDirectory = async () => {
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'drugs')
  try {
    await mkdir(uploadDir, { recursive: true })
    return uploadDir
  } catch (error) {
    console.error('Error creating uploads directory:', error)
    throw error
  }
}

const handleFileUpload = async (file) => {
  if (!file) return null

  const uploadDir = await createUploadsDirectory()
  const filename = `${Date.now()}-${file.filename}`
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, file.data)
  return `/uploads/drugs/${filename}`
}

const deleteOldImage = async (imageUrl) => {
  if (!imageUrl) return

  try {
    const filepath = join(process.cwd(), 'public', imageUrl)
    await unlink(filepath)
  } catch (error) {
    console.error('Error deleting old image:', error)
  }
}

const parseFormData = (formData) => {
  const drugData = {}
  let imageFile = null
  let drugId = null

  for (const field of formData) {
    if (field.name === 'image') {
      imageFile = field
    } else if (field.name === 'id') {
      drugId = field.data.toString()
    } else {
      let value = field.data.toString()
      if (['price', 'dosage'].includes(field.name)) {
        value = parseFloat(value)
      }
      drugData[field.name] = value
    }
  }

  return { drugData, imageFile, drugId }
}

export default defineEventHandler(async (event) => {
  const { method } = event.node.req

  try {
    switch (method) {
      case 'GET': {
        return await prisma.drug.findMany()
      }

      case 'POST': {
        const formData = await readMultipartFormData(event)
        if (!formData) {
          throw createError({
            statusCode: 400,
            message: 'No form data received'
          })
        }

        const { drugData, imageFile } = parseFormData(formData)

        if (imageFile) {
          const imagePath = await handleFileUpload(imageFile)
          if (imagePath) {
            drugData.imageUrl = imagePath
          }
        }

        return await prisma.drug.create({
          data: drugData
        })
      }

      case 'PUT': {
        const formData = await readMultipartFormData(event);
        if (!formData) {
          throw createError({
            statusCode: 400,
            message: 'No form data received',
          });
        }

        const { drugData, imageFile, drugId } = parseFormData(formData);

        if (!drugId) {
          throw createError({
            statusCode: 400,
            message: 'Drug ID is required',
          });
        }

        const existingDrug = await prisma.drug.findUnique({
          where: { id: drugId },
        });

        if (!existingDrug) {
          throw createError({
            statusCode: 404,
            message: 'Drug not found',
          });
        }

        if (imageFile) {
          const newImagePath = await handleFileUpload(imageFile);
          if (newImagePath) {
            if (existingDrug.imageUrl) {
              await deleteOldImage(existingDrug.imageUrl);
            }
            drugData.imageUrl = newImagePath;
          }
        }

        // Update the drug in the database
        const updatedDrug = await prisma.drug.update({
          where: { id: drugId },
          data: drugData, // Pass the drugData object here
        });

        return updatedDrug;
      }

      case 'DELETE': {
        const { id: deleteId } = await readBody(event)
        const drugToDelete = await prisma.drug.findUnique({
          where: { id: deleteId }
        })

        if (!drugToDelete) {
          throw createError({
            statusCode: 404,
            message: 'Drug not found'
          })
        }

        if (drugToDelete.imageUrl) {
          await deleteOldImage(drugToDelete.imageUrl)
        }

        return await prisma.drug.delete({
          where: { id: deleteId }
        })
      }

      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        })
    }
  } catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message
    })
  }
})