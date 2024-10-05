import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { method } = event.req

  try {
    switch (method) {
      case 'GET':
        return await prisma.drug.findMany()

      case 'POST':
        const body = await readBody(event)
        const newDrug = await prisma.drug.create({ data: {...body} })
        return newDrug

      case 'PUT':
        const { id, ...updateData } = await readBody(event)
        const existingDrug = await prisma.drug.findUnique({ where: { id } })
        if (!existingDrug) {
          return { error: 'Drug not found' }
        }
        return await prisma.drug.update({ where: { id }, data: updateData })

      case 'DELETE':
        const { id: deleteId } = await readBody(event)
        // ตรวจสอบว่ามี drug ที่ id นั้นอยู่จริง
        const drugToDelete = await prisma.drug.findUnique({ where: { id: deleteId } })
        if (!drugToDelete) {
          return { error: 'Drug not found' }
        }
        return await prisma.drug.delete({ where: { id: deleteId } })

      default:
        return { error: 'Method not allowed' }
    }
  } catch (error) {
    return { error: error.message }
  }
})
