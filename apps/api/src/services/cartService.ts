import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";

export async function getCart(userId: string) {
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  });
  return cart;
}

export async function replaceCart(
  userId: string,
  items: Array<{ productId: string; quantity: number }>
) {
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) }, status: "active" },
    include: { inventory: true },
  });
  const byId = new Map(products.map((product) => [product.id, product]));

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) {
      throw new HttpError(400, "One or more products are unavailable");
    }
    if ((product.inventory?.quantity ?? 0) < item.quantity) {
      throw new HttpError(409, `${product.name} does not have enough stock`);
    }
  }

  const cart = await getCart(userId);
  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
    ...items.map((item) => {
      const product = byId.get(item.productId)!;
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        },
      });
    }),
  ]);

  return getCart(userId);
}

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" as const } },
          inventory: true,
          category: true,
        },
      },
    },
  },
};
