import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const { method } = event.req

  try {
    switch (method) {
      case 'GET':
        return await prisma.products.findMany()
      
      case 'POST':
        const body = await readBody(event)
        const newProduct = await prisma.products.create({
          data: {
            ...body,
            remainQuantity: body.quantity
          }
        })
        return newProduct
      
      case 'PUT':
        const { id, ...updateData } = await readBody(event)
        return await prisma.products.update({
          where: { id },
          data: updateData
        })
      
      case 'DELETE':
        const { id: deleteId } = await readBody(event)
        return await prisma.products.delete({
          where: { id: deleteId }
        })
      
      default:
        return { error: 'Method not allowed' }
    }
  } catch (error) {
    return { error: error.message }
  }
})