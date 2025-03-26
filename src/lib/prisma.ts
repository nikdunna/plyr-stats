// This file is used to create a singleton instance of PrismaClient
// and to make it available globally. This is a common pattern to avoid
// creating a new PrismaClient instance on every request.
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
