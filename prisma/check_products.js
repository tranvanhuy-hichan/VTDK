import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true }
  });
  console.log("Current DB Products:", products);
}

main().finally(() => prisma.$disconnect());
