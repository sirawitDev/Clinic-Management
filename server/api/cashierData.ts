import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { diagnosisId } = req.query;

  try {
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id: parseInt(diagnosisId) },
      include: {
        patient: true,
        physician: true,
      },
    });

    if (!diagnosis) {
      return res.status(404).json({ error: 'Diagnosis not found' });
    }

    res.status(200).json({
      diagnosis,
      patient: diagnosis.patient,
      physician: diagnosis.physician,
    });
  } catch (error) {
    console.error('Error fetching cashier data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
