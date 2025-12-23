const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear existing users (optional but clean for dev)
  await prisma.user.deleteMany();

  // Insert initial users
  await prisma.user.createMany({
    data: [
      { name: "Alice", balance: 1000 },
      { name: "Bob", balance: 750 },
      { name: "Charlie", balance: 500 }
    ]
  });

  console.log("Users seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
