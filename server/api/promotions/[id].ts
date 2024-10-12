// /api/promotions/[id].ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req, res) => {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        if (id) {
          const promotion = await prisma.promotion.findUnique({
            where: { id: parseInt(id) },
          });
          if (!promotion) {
            return res.status(404).json({ success: false, message: 'Promotion not found' });
          }
          res.status(200).json({ success: true, promotion });
        } else {
          // Fetch all promotions
          const promotions = await prisma.promotion.findMany();
          res.status(200).json({ success: true, promotions });
        }
      } catch (error) {
        console.error('Error fetching promotion:', error);
        res.status(500).json({ success: false, error: 'Error fetching promotion' });
      }
      break;

    // POST: สร้างโปรโมชั่นใหม่
    case 'POST':
      const { name, imageUrl, about, startDate, endDate, status } = req.body;
      try {
        const promotion = await prisma.promotion.create({
          data: {
            name,
            imageUrl,
            about,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: status || 'active',
          },
        });
        res.status(201).json({ success: true, promotion });
      } catch (error) {
        console.error('Error creating promotion:', error);
        res.status(500).json({ success: false, error: 'Error creating promotion' });
      }
      break;

    case 'PUT':
      try {
        const updatedPromotion = await prisma.promotion.update({
          where: { id: parseInt(id) },
          data: {
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            about: req.body.about,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
            status: req.body.status || 'active',
          },
        });
        res.status(200).json({ success: true, promotion: updatedPromotion });
      } catch (error) {
        console.error('Error updating promotion:', error);
        res.status(500).json({ success: false, error: 'Error updating promotion' });
      }
      break;

    // DELETE: ลบโปรโมชั่น
    case 'DELETE':
      try {
        await prisma.promotion.delete({
          where: { id: parseInt(id) },
        });
        res.status(200).json({ success: true, message: 'Promotion deleted successfully' });
      } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ success: false, error: 'Error deleting promotion' });
      }
      break;

    // หากมีการใช้วิธีที่ไม่รองรับ
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).json({ success: false, message: `Method ${req.method} not allowed` });
  }
};
