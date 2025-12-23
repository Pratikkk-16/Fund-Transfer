const { PrismaClient } = require("@prisma/client");

// Singleton Prisma client to avoid exhausting database connections in dev.
const prisma = new PrismaClient();

module.exports = prisma;

