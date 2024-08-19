import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event).query || ''
  
  // ค้นหาเฉพาะในฟิลด์ firstname และ lastname
  const patients = await prisma.patients.findMany({
    where: {
      OR: [
        { firstname: { contains: query, mode: 'insensitive' } },
        { lastname: { contains: query, mode: 'insensitive' } }
      ]
    }
  })

  return patients
})