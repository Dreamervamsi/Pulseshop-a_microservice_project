import { Product , PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export { Product, prisma }
