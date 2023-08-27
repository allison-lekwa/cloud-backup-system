import { PrismaClient, Prisma } from "@prisma/client"


const prisma = new PrismaClient()

export const prismaDataType = Prisma;
export const User = prisma.coreUser;
export const HashedPassword = prisma.coreUserHashedPassword;
