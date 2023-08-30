import { PrismaClient, Prisma } from "@prisma/client"


const prisma = new PrismaClient()

export const prismaDataType = Prisma.CoreUserScalarFieldEnum;
export const User = prisma.coreUser;
export const HashedPassword = prisma.coreUserHashedPassword;
export const File = prisma.coreFile;
export const FileDir = prisma.coreFileDirectory;
