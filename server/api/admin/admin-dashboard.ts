import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    const dashboardStatus = await prisma.adminDashboard.findFirst();
    return dashboardStatus || { toggleOpenClose: false }; // คืนค่าเป็น false หากไม่มีข้อมูล
  } else if (method === 'POST') {
    const body = await readBody(event);
    const dashboardStatus = await prisma.adminDashboard.upsert({
      where: { id: 1 }, // ใช้ id เดียวเพื่อเก็บข้อมูลเพียงหนึ่งแถว
      update: { toggleOpenClose: body.toggleOpenClose },
      create: { toggleOpenClose: body.toggleOpenClose },
    });
    return dashboardStatus;
  }
});