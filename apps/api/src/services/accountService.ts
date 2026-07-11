import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";

export async function updateProfile(userId: string, name: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
}

export async function listAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(
  userId: string,
  data: {
    label: string;
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
  }
) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }
  return prisma.address.create({ data: { ...data, userId } });
}

export async function listSaved(userId: string) {
  return prisma.savedProduct.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          inventory: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function saveProduct(userId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new HttpError(404, "Product not found");
  }
  return prisma.savedProduct.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });
}

export async function unsaveProduct(userId: string, productId: string) {
  await prisma.savedProduct.deleteMany({ where: { userId, productId } });
}
