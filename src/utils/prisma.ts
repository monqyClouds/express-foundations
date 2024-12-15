import {PrismaClient} from '@prisma/client';
import {ENVIRONMENT, DATABASE_URL} from '../config';

let prisma: PrismaClient | undefined;

if (ENVIRONMENT === 'production') {
  prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };

  if (!globalWithPrisma.prisma) {
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
      // log: [
      //   {
      //     emit: 'event',
      //     level: 'query',
      //   },
      // ],
    });

    // prisma.$on('query', e => {
    //   console.log('Query: ' + e.query);
    //   console.log('Params: ' + e.params);
    //   console.log('Duration: ' + e.duration + 'ms');
    // });

    globalWithPrisma.prisma = prisma;
  }
  prisma = globalWithPrisma.prisma;
}

// if (typeof window === 'undefined') {
// }

export async function connectDB() {
  await prisma!.$connect();
  console.log('DB connected!');
}

export async function disconnectDB() {
  await prisma!.$disconnect();
}

export default prisma!;
