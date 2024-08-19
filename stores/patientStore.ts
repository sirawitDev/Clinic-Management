// stores/patientStore.ts
import { defineStore } from 'pinia'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const usePatientStore = defineStore('patient', {
  state: () => ({
    patients: [] as Array<any>,
    patientHistories: [] as Array<any>,
  }),
  actions: {
    async fetchPatients(query: string) {
      this.patients = await prisma.patients.findMany({
        where: {
          OR: [
            { firstname: { contains: query, mode: 'insensitive' } },
            { lastname: { contains: query, mode: 'insensitive' } },
          ],
        },
      })
    },
    async fetchPatientHistories(patientId: number) {
      this.patientHistories = await prisma.patientHistory.findMany({
        where: { patientId },
      })
    },
    async submitPatientHistory(patientHistoryData: any) {
      await prisma.patientHistory.create({
        data: patientHistoryData,
      })
    },
    async createDiagnosis(diagnosisData: any) {
      await prisma.diagnosis.create({
        data: diagnosisData,
      })
    },
  },
})