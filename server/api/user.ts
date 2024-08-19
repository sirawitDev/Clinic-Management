import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { method } = event.req

  switch (method) {
    case 'GET':
      return await prisma.patients.findMany()
    
    case 'POST':
      const body = await readBody(event)
      return await prisma.patients.create({ data: body })
    
    case 'PUT':
      const { id, ...updateData } = await readBody(event)
      return await prisma.patients.update({ where: { id }, data: updateData })
    
    case 'DELETE':
      const { id: deleteId } = await readBody(event)
      return await prisma.patients.delete({ where: { id: deleteId } })
    
    default:
      return { error: 'Method not allowed' }
  }
})