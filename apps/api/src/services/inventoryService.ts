import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";

type Db = PrismaClient | Prisma.TransactionClient;

export async function assertAndDecrement(
  productId: string,
  quantity: number,
  productName: string,
  db: Db = prisma
) {
  const updated = await db.inventory.updateMany({
    where: { productId, quantity: { gte: quantity } },
    data: { quantity: { decrement: quantity } },
  });

  if (updated.count === 0) {
    const inventory = await db.inventory.findUnique({ where: { productId } });
    if (!inventory) {
      throw new HttpError(409, `${productName} is not in inventory`);
    }
    throw new HttpError(409, `${productName} does not have enough stock`);
  }
}

export async function restoreStock(productId: string, quantity: number, db: Db = prisma) {
  await db.inventory.updateMany({
    where: { productId },
    data: { quantity: { increment: quantity } },
  });
}
