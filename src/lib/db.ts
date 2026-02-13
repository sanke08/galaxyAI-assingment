// import { PrismaClient, Prisma } from "../../prisma/generated/prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg'
// import 'dotenv/config'

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// })

// const prisma = new PrismaClient({
//   adapter,
// });

// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;




import { PrismaClient } from '../../prisma/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma}