import { prisma } from "../lib/prisma.js";

export function getInventory(productId: string) {
  return prisma.inventory.findUnique({ where: { productId } });
}

export function listInventory() {
  return prisma.inventory.findMany({
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { quantity: "asc" },
  });
}
