import { PrismaClient } from "@prisma/client";

// Singleton pour PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Utilisation de prismaGlobal si elle existe
const prisma = globalThis?.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
