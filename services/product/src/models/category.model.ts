import { Category , PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export { Category, prisma }
